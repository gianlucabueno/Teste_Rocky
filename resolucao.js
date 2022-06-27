const fs = require('fs');

const filePath = "./broken-database.json";
const lastFilePath = "./saida.json"
const en = 'utf-8'

//Primordial Functions
const WriteJSON = (filePath, data, encoding = en) =>{
    const promiseCallback = (resolve, reject) =>{
        fs.writeFile(filePath, JSON.stringify(data,null,2), encoding, (err) =>{
            if(err){
                reject(err);
                return;
            } 
            resolve(true);
        });
    };
    return new Promise(promiseCallback);
};

const ReadJSON = (filePath, encoding = en) =>{
    const promiseCallback = (resolve, reject) =>{
        fs.readFile(filePath, encoding, (err, data) =>{
            if(err){
                reject(err);
                return;
            }

            try{
                const object = JSON.parse(data);
                resolve(object);
            } 
            catch (e){
                reject(e)
            }
        });
    };
    return new Promise(promiseCallback);
};

const UpdateJSON = (filePath, newData, encoding = en) =>{
    const promiseCallback = async (resolve, reject) =>{
        try{
            const data = await ReadJSON(filePath, encoding);

            const result = {...data, ...newData};

            await WriteJSON(filePath, result, encoding);

            resolve(result);
        }
        catch(e){
            reject(e);
        }
    }
    return new Promise(promiseCallback);
};

//PART 1

//Fuctions for part 1 of the test
const changeName = (filePath, objectJSON) =>{
    try{
        Object.entries(objectJSON).map(([key, value]) => {
            value.name = value.name.replace(/([æ])+/g,"a");
            value.name = value.name.replace(/([ß])+/g,"b");
            value.name = value.name.replace(/([¢])+/g,"c");
            value.name = value.name.replace(/([ø])+/g,"o");

        });
        UpdateJSON(filePath, objectJSON);
    }   
    catch (e){  
        console.error(e)
    }
    
}

const changePrice = (filePath, objectJSON) =>{
    try {
        Object.entries(objectJSON).map(([key, value]) => {
            value.price = parseFloat(value.price); 
        });

        UpdateJSON(filePath, objectJSON);
    } 
    catch (e){  
        console.error(e)
    }

}

const changeQuantity = (filePath, objectJSON) =>{ 
    try {
        Object.entries(objectJSON).map(([key, value]) => {
            if (!objectJSON[key].hasOwnProperty("quantity")){
                value.quantity  = 0
            }

        });
        UpdateJSON(filePath, objectJSON);
    } 
    catch (e){  
        console.error(e)
    }
}

//exportJSON function this is both part 1 and part 2 of the test
const exportJSON = async (filePath, lastFilePath) =>{
    const objectJSON = await ReadJSON(filePath);
    
    changeName(filePath, objectJSON);
    changePrice(filePath, objectJSON);
    changeQuantity(filePath, objectJSON);

    try {
        WriteJSON(lastFilePath, objectJSON);
        return true;
    } 
    catch (e){  
        console.error(e)
    }
}

//Fuctions for part 2 of the test
const verify = async () =>{
    const status = await exportJSON(filePath,lastFilePath).catch(console.error);
    return status;
}

const productList = async (lastFilePath) =>{
    objectJSON = await ReadJSON(lastFilePath).catch(console.error);

    const listAll = Object.entries(objectJSON).map(([key, value]) => {
         return `${value.category} | ${value.id}  | ${value.name}   `;

    });
    console.log("\n>Product List< \n",listAll.sort());
}

const categoryQuantity = async (lastFilePath) =>{
    objectJSON = await ReadJSON(lastFilePath).catch(console.error);

    let homeA = 0;
    let electronics = 0;
    let accessories = 0;
    let pots = 0;

    Object.entries(objectJSON).map(([key, value]) => {
        if(value.category === "Eletrodomésticos"){
            homeA += value.quantity;
        }
        else if(value.category === "Eletrônicos"){
            electronics += value.quantity;
        }
        else if(value.category === "Acessórios"){
            accessories += value.quantity;
        }
        else if(value.category === "Panelas"){
            pots += value.quantity;
        }
    });
            
    console.log("\n>Quantidade por categoria<\n");
    console.log("Eletrodomésticos: ", homeA);
    console.log("Eletrônicos: ", electronics);
    console.log("Acessórios: ", accessories);
    console.log("Panelas: ", pots);
} 

const allVerify = async (lastFilePath) =>{
    const statusValue = await verify()  
    
    if(statusValue === true){
        categoryQuantity(lastFilePath);
        productList(lastFilePath);

    }
}

exportJSON(filePath, lastFilePath);
allVerify(lastFilePath)