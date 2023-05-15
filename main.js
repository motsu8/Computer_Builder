const config = {
    url: "https://api.recursionist.io/builder/computers",
};

class Parts {
    constructor(parts) {
        this.parts = parts;
        this.element = document.getElementById(parts)
        this.list = this.getData();
    }

    getData() {
        let list = [];
        fetch(config.url + "?type=" + this.parts)
            .then((res) => res.json())
                .then((data) => {
                    for(const ele of data){
                        if(ele.Type == this.parts.toUpperCase()) list.push(ele);
                    }
                });
        return list;
    }
}

class Ram extends Parts{
    constructor(parts){
        super(parts)
        this.keys = new Map();
        this.sortList = []
    }

    init(){
        this.getKeys();
        this.getSortList();
    }

    getKeys(){
        for(const ele of this.list){
            const model = this.getSpec(ele.Model)
            if(!this.keys.has(model)){
                this.keys.set(model, [ele])
            }else{
                this.keys.set(model, [...this.keys.get(model), ele])
            }
        }
    }

    // 最後のスペック取得
    getSpec(model){
        return parseInt(model.split(" ").pop()[0])
    }

    // sortList
    getSortList(){
        // 重複なしリスト
        const amountList = new Set();
        for(const ramEle of this.list){
            amountList.add(this.getSpec(ramEle.Model))
        }
        this.sortList = [...amountList]
        this.sortList.sort((a, b)=>a-b)
    }
}

class Storage extends Parts{
    constructor(parts){
        super(parts)
        this.types = [
            new Parts("hdd"),
            new Parts("ssd"),
        ]
    }
}

class View{
    constructor(){
        this.types = [
            new Parts("cpu"),
            new Parts("gpu"),
            new Ram("ram"),
            new Storage("storage"),
        ];
    }

    init(){
        for(const ele of this.types){
            const container = document.createElement("div");
            container.innerHTML = `
                <h3>Select Your ${ele.parts.toUpperCase()}</h3>
            `;

            switch(ele.parts){
                case"storage":
                container.innerHTML += `
                    <label for="step-2">SSD or HDD</label>
                    <select name="" id="step-2" class="col-3"></select>
                    <label for="step-2">Storage</label>
                    <select name="" id="step-2" class="col-3"></select>
                    `;
                    break;
                case"ram":
                    container.innerHTML += `
                    <label for="step-2">How many?</label>
                    <select name="" id="step-2" class="amount col-3"></select>
                    `;
                    break;
            }
            container.innerHTML += `
            <label for="step-2">Brand</label>
            <select name="" id="step-2" class="brand col-3"></select>
            <label for="step-2">Model</label>
            <select name="" id="step-2" class="col-3"></select>
            `;
            
            ele.element.append(container)
        }

        document.querySelectorAll("select").forEach(e=>{
            const option = document.createElement("option");
            option.innerHTML = "-"
            e.append(option);
        })
    }
}

class Ctrl{
    constructor(){}

    // Ramの描画
    static setRam(view){
        // ram取得
        const ram = view.types.filter(e=>e.parts == "ram").pop()
        ram.init();
        
        // amount描画
        const amountSelectTag = ram.element.querySelectorAll(".amount")[0];
        ram.sortList.forEach(e=>{
            const option = document.createElement("option");
            option.value = e;
            option.innerHTML = e;
            amountSelectTag.append(option);
        })

        amountSelectTag.addEventListener('change', e=>{
            // setBrand
            console.log(e.target.value)
        })
    }

    // CPU | GPU
    static setCore(view){
        for(const ele of view.types){
            if(ele.parts == "cpu" || ele.parts == "gpu"){
                // 重複なしリスト
                const brandList = new Set();
                for(const type of ele.list){
                    brandList.add(type.Brand)
                }
                // brand表示
                const brandSelectTag = ele.element.querySelectorAll(".brand")[0];
                brandList.forEach(e=>{
                    const option = document.createElement("option");
                    option.value = e;
                    option.innerHTML = e;
                    brandSelectTag.append(option)
                })
            }
        }
    }
}

const view = new View();
view.init()

setTimeout(() => {
    Ctrl.setCore(view)
    Ctrl.setRam(view)
}, 100);