const isEmpty = (data) => {
  if (
    data === undefined ||
    data === null ||
    (typeof data === "object" && Object.keys(data).length === 0) ||
    (typeof data === "string" && data.trim().length === 0)
  ) {
    return true;
  } else {
    return false;
  }
};
module.exports = isEmpty;
