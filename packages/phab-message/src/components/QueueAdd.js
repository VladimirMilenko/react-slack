import React from 'react';
import { Section, SectionText } from "@slack-react/host";

export const QueueAdd = ({ diffId }) => (
  <>
    <Section>
      <SectionText>
        !wadd {diffId}
      </SectionText >
    </Section>
  </>
);
