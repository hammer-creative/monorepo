import { ContentfulRichText } from '@/components/Common/ContentfulRichText';
import React from 'react';

export const HeroCopy: React.FC<{ data: string }> = ({ data }) => {
  return <ContentfulRichText richText={data} />;
};
