
export const findHeaderField = (field) => {
  return document.evaluate("//dt[contains(., '" + field + "')]", document).iterateNext();
}

export const getAuthor = () => {
  return document.evaluate('//*[@id="phabricator-standard-page-body"]/div[2]/div/div[2]/div/strong/a', document).iterateNext().innerText;
};

export const getJiraIssues = () => {
  const node = findHeaderField('JIRA Issues');
  if (node) {
    const linkedIssues = node.nextSibling.querySelectorAll('a');
    return Array.from(linkedIssues).map(issueNode => ({
      link: issueNode.href,
      label: issueNode.href.split('/browse/')[1],
    }));
  }

  return [];
}

export const getReviewers = () => {
  const node = findHeaderField('Reviewers');
  if (node) {
    const reviewers = node.nextSibling.querySelectorAll('a');
    return Array.from(reviewers).map(reviewerNode => reviewerNode.innerText);
  }

  return [];
}

export const getDiffTitle = () => {
  return document.querySelector('.phui-header-header').innerText;
}
export const getStatus = () => {
  return document.querySelector('.phui-tag-view').innerText;
}

export const getDiffId = () => {
  return document.querySelectorAll('.phui-crumb-name')[1].innerText;
}
