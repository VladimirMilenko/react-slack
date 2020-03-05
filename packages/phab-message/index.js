import React from 'react';
import {ObjectSlackContainer, Button, Section, SectionFields, } from '@slack-react/host';

const App = ({author, diffId, reviewers}) => (
  <Section>
    {author && <SectionFields>
        {author}
    </SectionFields>}
  </Section>
);

const container = new ObjectSlackContainer();
