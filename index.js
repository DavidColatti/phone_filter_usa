const fs = require("fs");
const phone = require("phone");
const zipcodes = require("zipcodes");
const csvOrExcel = require("csv-excel-to-json");
const cityZipByPhone = require("city-zip-by-phone");
const { convertArrayToCSV } = require("convert-array-to-csv");

const writeJson = async () => {
  try {
    csvOrExcel.convertToJson("./data.csv", "./data.json");

    return true;
  } catch (e) {
    return false;
  }
};

const main = async () => {
  try {
    let data;
    await writeJson();

    await setTimeout(async () => {
      data = require("./data.json");

      const newData = data.map((lead) => {
        const { phone_number } = lead;
        const info = phone(phone_number);
        let cleanedNum = "";

        if (info[0]) {
          cleanedNum = info[0].replace(/^\+1/g, "");
        }

        const location = cityZipByPhone(cleanedNum);

        const zip_code = location.zip;

        if (zip_code) {
          const zip_code_data = zipcodes.lookup(zip_code);
          location.state = zip_code_data.state;
        }

        let output = {
          ...lead,
          phone_number: cleanedNum,
          city: location.city,
          state: location.state,
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

      console.log(`Found ${filteredData.length} out of ${data.length}`);

      const csv = await convertArrayToCSV(filteredData);

      fs.writeFile("./output.csv", csv, (err) => {
        console.log(err || "Done");
      });
    }, 3000);
  } catch (e) {
    console.log("Failed");
  }
};

main();
