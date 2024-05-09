var arr =[
    {"name":"parot","type":1},
{"name":"myna","type":2},
{"name":"parot","type":1},
{"name":"myna","type":2}
] 
var duplicate = [];
var count =0;
for (let i = 0; i < arr.length; i++) {
   for (let j = 1; j < arr.length; j++) {
    if (arr[i].name==arr[j].name) {
        count++;
        duplicate=arr[i];
    }
   }
   console.log(duplicate)
    console.log(count)
}