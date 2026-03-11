// apps/web/src/app/work/page.tsx

import { Text } from '@/components/common';
import { CaseStudyCardModule } from '@/components/modules';
import { buildMetadata } from '@/config/metadata';
import { client, getWorkPage, resolveModuleColors } from '@/lib/sanity';
import type { CaseStudyCardModule as CaseStudyCardModuleType } from '@/types/sanity.generated';
import { toKebab } from '@/utils/stringUtils';

// TODO: do we need BEM for this?
const bem = 'work-page';

const moduleComponents = {
  caseStudyCardModule: CaseStudyCardModule,
} as const;

type ModuleData = CaseStudyCardModuleType;

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
      <div className={`${bem}__heading`}>
        <Text
          as="div"
          variant="tagline"
          text="Building from first spawn to new game+"
        />
        <Text as="h1" variant="primary" text="Our Work" />
      </div>
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
            <Component data={mod as ModuleData} />
          </section>
        );
      })}
    </>
  );
}
