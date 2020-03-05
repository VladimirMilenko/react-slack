import React from 'react';
import { Section, SectionFields, SlackDOM, Markdown, Context } from "@slack-react/host";

const MessageField = ({ title, content }) => (
  <Markdown>
    *{title}* {"\n"}
    {content}
  </Markdown>
);

export const DiffMessage = ({ status, reviewers, diffId, title, author, jiraIssues }) => (
  <>
    <Section>
      <SectionFields>
        {title && diffId && (
          <MessageField
            title="Diff"
            content={`<http://code.uberinternal.com/${diffId}|${title}>`}
          />
        )}
        {author && (
          <MessageField
            title="Author"
            content={`@${author}`}
          />
        )}
        {reviewers && (
          <MessageField title="Reviewers" content={reviewers.map(x => `@${x}`)} />
        )}
        {status && <MessageField title="Status" content={status} />}
        {Array.isArray(jiraIssues) && jiraIssues.length > 0 && (
          <MessageField
            title="JIRA"
            content={jiraIssues.map(x => `<${x.link}|${x.label}>`).join(", ")}
          />
        )}
      </SectionFields>
    </Section>
    <Context>
      Sent via awesome bot
  </Context>
  </>
);
