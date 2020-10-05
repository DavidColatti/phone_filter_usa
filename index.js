const phone = require("phone");
const ObjectsToCsv = require("objects-to-csv");
const data = require("./data.json");

const main = async () => {
  const newData = data.map((lead) => {
    const { phone_number } = lead;
    const info = phone(phone_number);
    let cleanedNum;

    if (info[0]) {
      cleanedNum = info[0].replace(/^\+1/g, "");
    }

    return {
      ...lead,
      cleanedPhoneFormat: cleanedNum,
    };
  });

  const filteredData = newData.filter((lead) => {
    if (!!lead.cleanedPhoneFormat === false) {
      return false;
    } else {
      return lead.countryCode === "USA" || lead.countryCode === undefined;
    }
  });

  console.log(`Found ${filteredData.length} out of ${data.length}`);
  const csv = new ObjectsToCsv(filteredData);
  await csv.toDisk("./data.csv");
};

main();
