// web/src/components/Common/ContentfulRichText.tsx
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import {
  Document as RichTextDocument,
  BLOCKS,
  MARKS,
} from '@contentful/rich-text-types';

const options = {
  renderMark: {
    [MARKS.BOLD]: (text: React.ReactNode) => <strong>{text}</strong>,
    [MARKS.ITALIC]: (text: React.ReactNode) => <em>{text}</em>,
    [MARKS.UNDERLINE]: (text: React.ReactNode) => <u>{text}</u>,
  },
  renderNode: {
    [BLOCKS.PARAGRAPH]: (_: unknown, children: React.ReactNode) => (
      <p>{children}</p>
    ),
  },
};

interface FormatContentfulRichTextProps {
  richText: RichTextDocument; // Use the correct type for richText
}

export const ContentfulRichText: React.FC<FormatContentfulRichTextProps> = ({
  richText,
}) => documentToReactComponents(richText, options);
