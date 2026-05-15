 export function    parse(text:string,values:any,startDelimeter='{',endDelimeter="}"){
        var startIndex =0;
        var endIndex = 1;
        var finalString = '';
        while(endIndex<text.length){
            if(text[startIndex]=='{'){
                const startPoint = startIndex+1
                let endPoint = startPoint +1
                while(text[endPoint]!='}'){
                    endPoint++
                }
                let stringHoldingValue = text.slice(startPoint,endPoint)
                const keys = stringHoldingValue.split('.');
                let localValues = {
                    ...values
                }   
                for(const key of keys){
                    if(typeof localValues=="string"){
                        localValues = JSON.parse(localValues);
                    }
                    localValues = localValues[key]
                }
                finalString += localValues;
                startIndex = endPoint + 1;
                endIndex = endPoint + 2;
            }else{
                finalString +=text[startIndex]
                startIndex++
                endIndex++
            }
        }
        if(text[startIndex]){
            finalString +=text[startIndex]
        }
        return finalString
    }
    