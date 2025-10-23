import { FieldAppSDK } from '@contentful/app-sdk';
import {
  Button,
  Stack,
  Card,
  FormControl,
  Switch,
  Select,
} from '@contentful/f36-components';
import { useSDK } from '@contentful/react-apps-toolkit';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import type { Asset } from 'contentful';
import React, { useState } from 'react';

interface Module {
  image?: {
    id: string;
    url: string;
  };
  text: string;
  imageRight: boolean;
  backgroundColor: string;
}

const COLORS = [
  { name: 'Stealth', hex: '#141515' },
  { name: 'Alloy', hex: '#778888' },
  { name: 'Nimbus', hex: '#C7D3D3' },
  { name: 'Hyperbeam', hex: '#0066CC' },
];

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  sdk: FieldAppSDK;
}

const RichTextEditor = ({ content, onChange, sdk }: RichTextEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) {
    return null;
  }

  const setLink = async () => {
    const url = await sdk.dialogs.openPrompt({
      title: 'Add Link',
      message: 'Enter URL:',
      intent: 'positive',
      confirmLabel: 'Add',
      cancelLabel: 'Cancel',
    });

    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  return (
    <div style={{ border: '1px solid #ccc', borderRadius: '4px' }}>
      <div
        style={{
          padding: '8px',
          borderBottom: '1px solid #ccc',
          display: 'flex',
          gap: '4px',
        }}
      >
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          style={{
            padding: '4px 8px',
            fontWeight: editor.isActive('bold') ? 'bold' : 'normal',
            background: editor.isActive('bold') ? '#e0e0e0' : 'white',
          }}
        >
          B
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          style={{
            padding: '4px 8px',
            fontStyle: 'italic',
            background: editor.isActive('italic') ? '#e0e0e0' : 'white',
          }}
        >
          I
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          style={{
            padding: '4px 8px',
            textDecoration: 'underline',
            background: editor.isActive('underline') ? '#e0e0e0' : 'white',
          }}
        >
          U
        </button>
        <button
          type="button"
          onClick={setLink}
          style={{
            padding: '4px 8px',
            background: editor.isActive('link') ? '#e0e0e0' : 'white',
          }}
        >
          Link
        </button>
      </div>
      <div style={{ padding: '12px', minHeight: '120px' }}>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

const Field = () => {
  const sdk = useSDK<FieldAppSDK>();
  const [modules, setModules] = useState<Module[]>(() => {
    const value = sdk.field.getValue();
    return Array.isArray(value) ? value : [];
  });

  const updateField = (newModules: Module[]) => {
    setModules(newModules);
    sdk.field.setValue(newModules);
  };

  const addModule = () => {
    updateField([
      ...modules,
      {
        text: '',
        imageRight: false,
        backgroundColor: COLORS[0].hex,
      },
    ]);
  };

  const removeModule = (index: number) => {
    updateField(modules.filter((_, i) => i !== index));
  };

  const updateModule = (index: number, updates: Partial<Module>) => {
    const updated = [...modules];
    updated[index] = { ...updated[index], ...updates };
    updateField(updated);
  };

  const selectImage = async (index: number) => {
    const results = await sdk.dialogs.selectMultipleAssets({
      locale: 'en-US',
      max: 1,
    });

    if (results && results[0]) {
      const asset = results[0] as Asset;
      if (asset.fields?.file) {
        updateModule(index, {
          image: {
            id: asset.sys.id,
            url: asset.fields.file['en-US']?.url || '',
          },
        });
      }
    }
  };

  const uploadImage = async (index: number) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
        // Read file as ArrayBuffer
        const arrayBuffer = await file.arrayBuffer();

        const upload = await sdk.cma.upload.create(
          { spaceId: sdk.ids.space },
          {
            file: arrayBuffer,
            fileName: file.name,
            contentType: file.type,
          },
        );

        const asset = await sdk.cma.asset.create(
          { spaceId: sdk.ids.space, environmentId: sdk.ids.environment },
          {
            fields: {
              title: { 'en-US': file.name },
              file: {
                'en-US': {
                  contentType: file.type,
                  fileName: file.name,
                  uploadFrom: {
                    sys: {
                      type: 'Link',
                      linkType: 'Upload',
                      id: upload.sys.id,
                    },
                  },
                },
              },
            },
          },
        );
        const processed = await sdk.cma.asset.processForAllLocales(
          {
            spaceId: sdk.ids.space,
            environmentId: sdk.ids.environment,
            assetId: asset.sys.id,
          },
          asset,
        );

        const published = await sdk.cma.asset.publish(
          {
            spaceId: sdk.ids.space,
            environmentId: sdk.ids.environment,
            assetId: processed.sys.id,
          },
          processed,
        );

        updateModule(index, {
          image: {
            id: published.sys.id,
            url: published.fields.file['en-US'].url,
          },
        });
      } catch (error) {
        console.error('Upload failed:', error);
        sdk.notifier.error('Failed to upload image');
      }
    };
    input.click();
  };

  return (
    <Stack flexDirection="column" spacing="spacingM">
      {modules.map((module, index) => (
        <Card key={index} padding="large">
          <Stack flexDirection="column" spacing="spacingM">
            <FormControl>
              <FormControl.Label>Image</FormControl.Label>
              <Stack flexDirection="row" spacing="spacingS">
                <Button onClick={() => selectImage(index)} size="small">
                  {module.image ? 'Change Image' : 'Select Image'}
                </Button>
                <Button
                  onClick={() => uploadImage(index)}
                  size="small"
                  variant="secondary"
                >
                  Upload New
                </Button>
              </Stack>
              {module.image && (
                <img
                  src={module.image.url}
                  alt=""
                  style={{ maxWidth: '200px', marginTop: '8px' }}
                />
              )}
            </FormControl>

            <FormControl>
              <Switch
                isChecked={module.imageRight}
                onChange={() =>
                  updateModule(index, { imageRight: !module.imageRight })
                }
              >
                Image on Right
              </Switch>
            </FormControl>

            <FormControl>
              <FormControl.Label>Background Color</FormControl.Label>
              <Stack flexDirection="row" spacing="spacingS" alignItems="center">
                <Select
                  value={module.backgroundColor}
                  onChange={(e) =>
                    updateModule(index, { backgroundColor: e.target.value })
                  }
                >
                  {COLORS.map((color) => (
                    <Select.Option key={color.hex} value={color.hex}>
                      {color.name}
                    </Select.Option>
                  ))}
                </Select>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    backgroundColor: module.backgroundColor,
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                  }}
                />
              </Stack>
            </FormControl>

            <FormControl>
              <FormControl.Label>Text</FormControl.Label>
              <RichTextEditor
                content={module.text}
                onChange={(html) => updateModule(index, { text: html })}
              />
            </FormControl>

            <Button
              variant="negative"
              onClick={() => removeModule(index)}
              size="small"
            >
              Remove Module
            </Button>
          </Stack>
        </Card>
      ))}

      <Button onClick={addModule} variant="primary">
        Add Module
      </Button>
    </Stack>
  );
};

export default Field;
