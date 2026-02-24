// apps/web/src/app/work/page.tsx

import { CaseStudyCardModule, TextModule } from '@/components/modules';
import { buildMetadata } from '@/config/metadata';
import { client, getWorkPage, resolveModuleColors } from '@/lib/sanity';
import type {
  CaseStudyCardModule as CaseStudyCardModuleType,
  TextModule as TextModuleType,
} from '@/types/sanity.generated';
import { toKebab } from '@/utils/stringUtils';

// TODO: do we need BEM for this?
const bem = 'work';

const moduleComponents = {
  caseStudyCardModule: CaseStudyCardModule,
  textModule: TextModule,
} as const;

type ModuleData = CaseStudyCardModuleType | TextModuleType;

export const metadata = buildMetadata('Work');

export const revalidate = 60;

/**
 * Renders the Work page. Modules are fetched from Sanity and rendered
 * dynamically via `moduleComponents`.
 */
export default async function WorkPage() {
  const workPage = await getWorkPage(client);

  if (!workPage) return null;

  const resolvedModules = workPage.modules?.map(resolveModuleColors) ?? [];

  return (
    <>
      {resolvedModules.map((mod) => {
        const Component =
          moduleComponents[mod._type as keyof typeof moduleComponents];

        if (!Component) {
          console.warn(`No component found for module type "${mod._type}"`);
          return null;
        }

        return (
          <section
            key={mod._key}
            className={`module ${toKebab(mod._type)}`}
            style={
              {
                '--module-bg': mod.backgroundColor?.hex,
                '--module-text': mod.textColor?.hex,
              } as React.CSSProperties
            }
          >
            {/* @ts-expect-error - Dynamic module rendering */}
            <Component data={mod as ModuleData} />
          </section>
        );
      })}
    </>
  );
}
