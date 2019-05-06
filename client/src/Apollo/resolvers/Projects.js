const list = async project => {
  const lists = await window.Trello.get(`/boards/${project.thirdPartyId}/lists`);
  return lists;
};

export default { queries: { list } };
