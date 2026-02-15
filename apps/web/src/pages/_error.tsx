// apps/web/src/pages/_error.tsx

import type { NextPageContext } from 'next';
import Error from 'next/error';

interface ErrorProps {
  statusCode?: number;
}

const CustomErrorComponent = (props: ErrorProps) => {
  return <Error statusCode={props.statusCode || 500} />;
};

CustomErrorComponent.getInitialProps = async (contextData: NextPageContext) => {
  return Error.getInitialProps(contextData);
};

export default CustomErrorComponent;
