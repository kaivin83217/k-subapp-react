const baseUrl =
  process.env.NODE_ENV === "development" ? "" : `http://kfreestyle.top:7003`;
const kbaseUrl = `${baseUrl}/kfreestyle/`;
const Service = {
  getAccount: `GET getUsers ${kbaseUrl}`,
  getSetting: `GET getSetting ${kbaseUrl}`,
  getMenuConfig: `GET getMenuConfig ${kbaseUrl}`,
  postMenuConfig: `POST postMenuConfig ${kbaseUrl}`,
  getMenuStyle: `GET getMenuStyle ${kbaseUrl}`,
  postMenuStyle: `POST putMenuStyle ${kbaseUrl}`,
  deleteMenuConfig: `POST deleteMenuConfig ${kbaseUrl}`,
};

export default Service;
