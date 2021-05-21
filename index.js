const fs = require("fs");
const phone = require("phone");
const zipcodes = require("zipcodes");
const cityZipByPhone = require("city-zip-by-phone");
const { csvFileToArray, arrayToCsvFile } = require("csv-to-and-from-array");

const main = async () => {
  try {
    const data = await csvFileToArray({
      filePath: "./data.csv",
      callback: () => console.log("Converted csv to array"),
    });

    const newData = data.map((lead) => {
      const { phone_number } = lead;
      const info = phone(phone_number);
      let cleanedNum = "";

      if (info[0]) {
        cleanedNum = info[0].replace(/^\+1/g, "");
      }

      const location = cityZipByPhone(cleanedNum);

      const zip_code = location.zip;

      let state = "";
      if (zip_code) {
        const zip_code_data = zipcodes.lookup(zip_code);

        if (zip_code_data) {
          state = zip_code_data.state;
        }
      }

      let output = {
        ...lead,
        phone_number: cleanedNum,
        city: location.city,
        state: state,
        zip: zip_code,
        countryCode: info[1] || "",
      };

      return output;
    });

    const filteredData = newData.filter((lead) => {
      if (!!lead.phone_number === false) {
        return false;
      } else {
        return lead.countryCode === "USA" || lead.countryCode === undefined;
      }
    });

    arrayToCsvFile({
      data: filteredData,
      filePath: "./output.csv",
      callback: () =>
        console.log(`Found ${filteredData.length} out of ${data.length}`),
    });
  } catch (e) {
    console.log("Failed");
  }
};

main();
