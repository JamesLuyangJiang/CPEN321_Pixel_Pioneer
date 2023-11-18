async function getScheduledEvents(req, res) {
  const { id } = req.params;
  let responseObj = [];
  if (id == "") {
    responseObj = [];
    res.status(400).send("ERROR!!");
  } else if (id == 1) {
    responseObj = [
      { id: id, name: "UBC", date: "2023-12-03" },
      { id: id, name: "Kits", date: "2023-12-06" },
    ];
    res.status(200).send(responseObj);
  } else if (id == 2) {
    responseObj = [{ id: id, name: "Burnaby", date: "2023-12-11" }];
    res.status(200).send(responseObj);
  } else {
    responseObj = [];
    res.status(200).send(responseObj);
  }
}

module.exports = { getScheduledEvents };
