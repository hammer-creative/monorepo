// apps/web/src/app/work/page.tsx
import { CaseStudyCardModule, TextModule } from '@/components/modules';
import { client, getWorkPage, resolveModuleColors } from '@/lib/sanity';
import type {
  CaseStudyCardModule as CaseStudyCardModuleType,
  TextModule as TextModuleType,
} from '@/types/sanity.generated';
import { toKebab } from '@/utils/stringUtils';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Work',
  openGraph: {
    title: 'Work',
    type: 'website',
  },
};

export const revalidate = 60;

const moduleComponents = {
  caseStudyCardModule: CaseStudyCardModule,
  textModule: TextModule,
} as const;

type ModuleData = CaseStudyCardModuleType | TextModuleType;

export default async function WorkPage() {
  const workPage = await getWorkPage(client);

  if (!workPage) return null;

  const resolvedModules = workPage.modules?.map(resolveModuleColors) || [];

  return (
    <div className="layout-wrapper">
      {resolvedModules.map((mod) => {
        const Component =
          moduleComponents[mod._type as keyof typeof moduleComponents];

        if (!Component) return null;

        const { _key, backgroundColor, textColor } = mod;

        return (
          <section
            key={_key}
            className={`module ${toKebab(mod._type)}`}
            style={
              {
                '--module-bg': backgroundColor?.hex,
                '--module-text': textColor?.hex,
              } as React.CSSProperties
            }
          >
            {/* @ts-expect-error - Dynamic module rendering */}
            <Component data={mod as ModuleData} />
          </section>
        );
      })}
    </div>
  );
}
