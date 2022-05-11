const uuid = require("node-uuid");

export default function guid() {
  return uuid.v1();
}
