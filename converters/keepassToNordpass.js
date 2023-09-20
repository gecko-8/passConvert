const xml2js = require('xml2js');
const fs = require('fs');

class KeepassToNordpass {
    #inputFile;
    #outputFile;

    constructor(inputFile, outputFile) {
        this.#inputFile = inputFile;
        this.#outputFile = outputFile;
    }

    convertData() {
        // Helpers -----------------
        const processRoot = (rootItem) => {
            rootItem.Group
                .filter(group => group.Name[0] !== 'Backup')
                .forEach(group => {
                    processGroup(group, null);
                });
        
            // Close the output file
            writer.close();
        }
        
        const processGroup = (groupItem, baseName) => {
            // Build the new group/folder name
            const groupName = groupItem.Name[0];
            if (baseName != null)
                baseName += `/${groupName}`;
            else
                baseName = groupName;
            console.log('');
            console.log(baseName);
            console.log('----------------------------');
        
            // Process password items
            if (groupItem.Entry != null) {
                groupItem.Entry.forEach(entry => {
                    processItem(entry, baseName);
                });
            }
        
            // Process sub-groups
            if (groupItem.Group != null) {
                groupItem.Group.forEach(group => {
                    processGroup(group, baseName);
                });
            }
        }
        
        const processItem = (item, groupName) => {
            const values = parseValues(item.String);
        
            const csvRow = 
            `"${values.Title}","${values.URL}","${values.UserName}","${values.Password}","${values.Notes}",,,,,,"${groupName}",,,,,,,\n`;
        
            writer.write(csvRow);
        }
        
        const parseValues = (values) => {
            let result = {};
        
            values.forEach(value => {
                if (value.Key[0] === 'Password') {
                    result[value.Key[0]] = value.Value[0]['_'];
                } else {
                    result[value.Key[0]] = value.Value[0];
                }
            });
            console.log(result);
            return result;
        }

        // Execution ------------
        const parser = new xml2js.Parser({ attrkey: 'ATTR' });

        let xmlString = fs.readFileSync(this.#inputFile, 'utf8');
        let writer = fs.createWriteStream(this.#outputFile);
        writer.write('name,url,username,password,note,cardholdername,cardnumber,cvc,expirydate,zipcode,folder,full_name,phone_number,email,address1,address2,city,country,state\n');
        
        // Convert the XML to JSON
        parser.parseString(xmlString, function(error, result) {
            if(error != null) {
                console.log(error);
                throw new Error('Unable to process input file');
            }

            console.log(this);
            processRoot(result.KeePassFile.Root[0].Group[0]);
        });
    }
}

module.exports = KeepassToNordpass;