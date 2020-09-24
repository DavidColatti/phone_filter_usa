const phone = require("phone");
const ObjectsToCsv = require("objects-to-csv");
const data = require("./data.json");

const main = async () => {
  const newData = data.map((lead) => {
    const { final_phone_number } = lead;
    const info = phone(final_phone_number);

    return {
      ...lead,
      cleanedPhoneFormat: info[0],
      countryCode: info[1],
    };
  });

  const filteredData = newData.filter(
    (lead) => lead.countryCode === "USA" || lead.countryCode === undefined
  );

  const csv = new ObjectsToCsv(filteredData);
  await csv.toDisk("./data.csv");
};

main();
