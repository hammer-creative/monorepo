// TODO: add common title component, add common text component
// apps/web/src/components/modules/HomePage/HomePageTextModule.ts
import { TextBlock } from '@/components/common/TextBlock';
import type { TextModuleType } from '@/types/sanity';

export function HomePageTextModule({ data }: { data: TextModuleType }) {
  return (
    <>
      {data.tag && <div className="tag">{data.tag}</div>}
      {data.title && <h2>{data.title}</h2>}
      {data.body && <TextBlock body={data.body} className="text medium" />}
    </>
  );
}
