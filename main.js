const config = {
    url: "https://api.recursionist.io/builder/computers",
};

class Parts {
    constructor(parts) {
        this.parts = parts;
        this.element = document.getElementById(parts)
        this.brandTag = null;
        this.modelTag = null;
        this.list = this.getData();
        this.currentBrand = null;
        this.currentModel = null;
        this.drawBrandList = null;
        this.drawModelList = null;
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

    setTag(){
        this.brandTag = this.element.querySelectorAll(".brand")[0];
        this.modelTag = this.element.querySelectorAll(".model")[0];
        this.amountTag = this.element.querySelectorAll(".amount")[0];
    }

    checkCurrent(){
        console.log(`(Amount: ${this.currentAmount}), (Brand: ${this.currentBrand}), (Model: ${this.currentModel}), `)
    }

    // brand描画
    setBrand(){
        this.drawBrandList = new Set();
        this.list.forEach(e=>{
            this.drawBrandList.add(e.Brand)
        })
        this.drawBrandList.forEach(e=>{
            const option = document.createElement("option");
            option.value = e;
            option.innerHTML = e;
            this.brandTag.append(option);
        })
    }
    // model描画
    setModel(){
        this.drawModelList = new Set();
        this.list.forEach(e=>{
            if(e.Brand == this.currentBrand) this.drawModelList.add(e.Model)
        })
        console.log(this.drawBrandList)
        this.drawModelList.forEach(e=>{
            const option = document.createElement("option");
            option.value = e;
            option.innerHTML = e;
            this.modelTag.append(option);
        })
    }

    resetBrand(){
        this.brandTag.innerHTML = "";
        const option = document.createElement("option");
        option.innerHTML = "-";
        this.brandTag.append(option);
    }

    resetModel(){
        this.modelTag.innerHTML = "";
        const option = document.createElement("option");
        option.innerHTML = "-";
        this.modelTag.append(option);
    }
}

class Ram extends Parts{
    constructor(parts){
        super(parts)
        this.keys = new Map();
        this.sortList = []
        this.currentAmount = null;
        this.amountTag = null;
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
        return model.split(" ").pop()[0]
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

    // brand描画
    setBrand(){
        const list = this.keys.get(this.currentAmount);
        const drawBrandList = new Set();
        list.forEach(e=>{
            drawBrandList.add(e.Brand)
        })
        drawBrandList.forEach(e=>{
            const option = document.createElement("option");
            option.value = e;
            option.innerHTML = e;
            this.brandTag.append(option);
        })
    }

    // model描画
    setModel(){
        const list = this.keys.get(this.currentAmount);
        this.drawModelList = new Set();
        list.forEach(e=>{
            if(e.Brand == this.currentBrand) this.drawModelList.add(e.Model)
        })
        this.drawModelList.forEach(e=>{
            const option = document.createElement("option");
            option.value = e;
            option.innerHTML = e;
            this.modelTag.append(option);
        })
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
            <select name="" id="step-2" class="model col-3"></select>
            `;
            
            ele.element.append(container)
            
            // tag指定
            ele.setTag();
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
        ram.sortList.forEach(e=>{
            const option = document.createElement("option");
            option.value = e;
            option.innerHTML = e;
            ram.amountTag.append(option);
        })

        // setBrand
        ram.amountTag.addEventListener('change', e=>{
            ram.resetBrand();
            ram.resetModel();
            ram.currentAmount = e.target.value
            ram.setBrand();
        })

        // setModel
        ram.brandTag.addEventListener('change', e=>{
            ram.resetModel();
            ram.currentBrand = e.target.value
            ram.setModel();
        })
        
        ram.modelTag.addEventListener('change', e=>{
            ram.currentModel = e.target.value;
            ram.checkCurrent();
        })
    }
    
    // CPU | GPU
    static setCore(view){
        for(const ele of view.types){
            if(ele.parts == "cpu" || ele.parts == "gpu"){
                // brand描画
                ele.setBrand();

                // model描画
                ele.brandTag.addEventListener("change", e=>{
                    ele.resetModel();
                    ele.currentBrand = e.target.value;
                    ele.setModel();
                })
                ele.modelTag.addEventListener("change", e=>{
                    ele.currentModel = e.target.value
                    ele.checkCurrent();
                })
            }
        }
    }
}

const view = new View();
view.init();

setTimeout(() => {
    Ctrl.setCore(view);
    Ctrl.setRam(view);
}, 100);