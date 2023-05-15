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
        this.parts = [
            new Parts("cpu"),
            new Parts("gpu"),
            new Parts("ram"),
            new Storage("storage"),
        ];
    }

    init(){
        for(const ele of this.parts){
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
                    <select name="" id="step-2" class="col-3"></select>
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

    // Brand描画
    static setBrand(view){
        for(const parts of view.parts){
            // 重複なしリスト
            const brandList = new Set();
            for(const type of parts.list){
                brandList.add(type.Brand)
            }

            // brand表示
            const brandEle = parts.element.querySelectorAll(".brand")[0];
            brandList.forEach(e=>{
                const option = document.createElement("option");
                option.value = e;
                option.innerHTML = e;
                brandEle.append(option)
            })
        }
    }

}

const view = new View();
view.init()

setTimeout(() => {
    Ctrl.setBrand(view)
}, 50);