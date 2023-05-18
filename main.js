const config = {
    url: "https://api.recursionist.io/builder/computers",
    calcBtn: document.getElementById("calcBtn"),
    pc: document.getElementById("pc"),
};

class Parts {
    constructor(parts) {
        this.parts = parts;
        this.element = document.getElementById(parts);
        this.brandTag = null;
        this.modelTag = null;
        this.list = this.getData();
        this.currentBrand = null;
        this.currentModel = null;
    }

    getData() {
        let list = [];
        fetch(config.url + "?type=" + this.parts)
            .then((res) => res.json())
            .then((data) => {
                for (const ele of data) {
                    if (ele.Type == this.parts.toUpperCase()) list.push(ele);
                }
            });
        return list;
    }

    setTag() {
        this.brandTag = this.element.querySelectorAll(".brand")[0];
        this.modelTag = this.element.querySelectorAll(".model")[0];
    }

    checkCurrent() {
        console.log(this.currentModel);
    }

    createOption(e) {
        const option = document.createElement("option");
        option.value = e;
        option.innerHTML = e;
        return option;
    }

    setCurrentBrand(brand) {
        this.currentBrand = [];
        this.list.forEach((e) => {
            if (e.Brand.includes(brand)) this.currentBrand.push(e);
        });
    }

    setCurrentModel(model) {
        const list = new Set();
        this.currentBrand.forEach((e) => {
            if (e.Model.includes(model)) list.add(e);
        });

        this.currentModel = [...list].pop();
    }

    // brand描画
    drawBrand() {
        const drawList = new Set();
        this.list.forEach((e) => {
            drawList.add(e.Brand);
        });
        drawList.forEach((e) => {
            this.brandTag.append(this.createOption(e));
        });
    }

    // model描画
    drawModel() {
        const drawList = new Set();
        this.currentBrand.forEach((e) => {
            drawList.add(e.Model);
        });
        drawList.forEach((e) => {
            this.modelTag.append(this.createOption(e));
        });
    }

    resetBrand() {
        this.brandTag.innerHTML = "";
        this.brandTag.append(this.createOption("-"));
    }

    resetModel() {
        this.modelTag.innerHTML = "";
        this.modelTag.append(this.createOption("-"));
    }
}

class Ram extends Parts {
    constructor(parts) {
        super(parts);
        this.keys = new Map();
        this.sortList = [];
        this.currentAmount = null;
        this.amountTag = null;
    }

    setTag() {
        this.brandTag = this.element.querySelectorAll(".brand")[0];
        this.modelTag = this.element.querySelectorAll(".model")[0];
        this.amountTag = this.element.querySelectorAll(".amount")[0];
    }

    // model最後の枚数取得
    getSpec(model) {
        return model.split(" ").pop()[0];
    }

    setCurrentAmount(amount) {
        this.currentAmount = [];
        this.list.forEach((e) => {
            if (this.getSpec(e.Model) == amount) this.currentAmount.push(e);
        });
    }

    setCurrentBrand(brand) {
        this.currentBrand = [];
        this.currentAmount.forEach((e) => {
            if (e.Brand == brand) this.currentBrand.push(e);
        });
    }

    // sortList
    drawAmount() {
        // 重複なしリスト
        const amountList = new Set();
        for (const ramEle of this.list) {
            amountList.add(this.getSpec(ramEle.Model));
        }
        this.sortList = [...amountList];
        this.sortList.sort((a, b) => a - b);
        this.sortList.forEach((e) => {
            this.amountTag.append(this.createOption(e));
        });
    }

    // brand描画
    drawBrand() {
        const drawBrandList = new Set();
        this.currentAmount.forEach((e) => {
            drawBrandList.add(e.Brand);
        });
        drawBrandList.forEach((e) => {
            this.brandTag.append(this.createOption(e));
        });
    }

    // model描画
    drawModel() {
        const drawModelList = new Set();
        this.currentBrand.forEach((e) => {
            drawModelList.add(e.Model);
        });
        drawModelList.forEach((e) => {
            this.modelTag.append(this.createOption(e));
        });
    }
}

class Storage extends Parts {
    constructor(parts) {
        super(parts);
        this.types = [new Parts("hdd"), new Parts("ssd")];
        this.currentType = null;
        this.currentCapacity = null;
        this.currentCapacityStr = "";
        this.typeTag = null;
        this.capacityTag = null;
    }

    // tag設定
    setTag() {
        this.typeTag = this.element.querySelectorAll(".type")[0];
        this.capacityTag = this.element.querySelectorAll(".capacity")[0];
        this.brandTag = this.element.querySelectorAll(".brand")[0];
        this.modelTag = this.element.querySelectorAll(".model")[0];
    }

    // 現在のtype更新
    setCurrentType(type) {
        this.currentType = this.types
            .filter((e) => e.parts == type.toLowerCase())
            .pop();
    }

    // 現在のcapacity更新
    setCurrentCapacity(capacity) {
        this.currentCapacity = [];
        this.currentType.list.forEach((e) => {
            if (e.Model.includes(capacity)) this.currentCapacity.push(e);
        });
        this.currentCapacityStr = capacity;
    }

    // 現在のbrand更新
    setCurrentBrand(brand) {
        this.currentBrand = [];
        this.currentCapacity.forEach((e) => {
            if (e.Brand.includes(brand)) this.currentBrand.push(e);
        });
    }

    resetCapacity() {
        this.capacityTag.innerHTML = "";
        this.capacityTag.append(this.createOption("-"));
    }

    // currentTypeをもとにcapacity描画
    drawCapacity() {
        const drawList = new Set();
        for (const ele of this.currentType.list) {
            const capacity = ele.Model.split(" ")
                .filter((e) => e.includes("TB") || e.includes("GB"))
                .pop();
            drawList.add(capacity);
        }
        drawList.forEach((e) => {
            this.capacityTag.append(this.createOption(e));
        });
    }

    // currentCapacityをもとにbrand描画
    drawBrand() {
        const drawList = new Set();
        for (const ele of this.currentCapacity) {
            drawList.add(ele.Brand);
        }
        drawList.forEach((e) => {
            this.brandTag.append(this.createOption(e));
        });
    }

    // currentBrandをもとにmodel描画
    drawModel() {
        const drawList = new Set();
        for (const ele of this.currentBrand) {
            drawList.add(ele.Model);
        }
        drawList.forEach((e) => {
            this.modelTag.append(this.createOption(e));
        });
    }
}

class View {
    constructor() {
        this.types = [
            new Parts("cpu"),
            new Parts("gpu"),
            new Ram("ram"),
            new Storage("storage"),
        ];
    }

    init() {
        for (const ele of this.types) {
            const container = document.createElement("div");
            container.innerHTML = `
                <h3>Select Your ${ele.parts.toUpperCase()}</h3>
            `;

            switch (ele.parts) {
                case "storage":
                    container.innerHTML += `
                    <label for="step-2">HDD or SSD</label>
                    <select name="" id="step-2" class="type col-3"></select>
                    <label for="step-2">Capacity</label>
                    <select name="" id="step-2" class="capacity col-3"></select>
                    `;
                    break;
                case "ram":
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

            ele.element.append(container);

            // tag指定
            ele.setTag();
        }

        const selectTag = document.querySelectorAll("select");

        selectTag.forEach((e) => {
            const option = document.createElement("option");
            option.innerHTML = "-";
            e.append(option);

            e.addEventListener("change", ()=>{
                this.clearPC()
            })
        });

        config.calcBtn.addEventListener("click", () => {
            console.log(`game: ${Ctrl.calcGamePerformance(view)}`);
            console.log(`work: ${Ctrl.calcWorkPerformance(view)}`);
            this.drawPC();
        });
    }

    drawPC() {
        // パーツ描画
        this.types.forEach((e) => {
            if (e.parts == "storage") {
                config.pc.innerHTML += `
                    <div class="p-3">
                        <h4>${e.parts.toUpperCase()}</h4>
                        <div>Disc: ${e.currentType.parts.toUpperCase()}</div>
                        <div>Storage: ${e.currentCapacityStr}</div>
                        <div>Brand: ${e.currentModel.Brand}</div>
                        <div>Model: ${e.currentModel.Model}</div>
                    </div>
                `;
            } else {
                config.pc.innerHTML += `
                    <div class="p-3">
                        <h4>${e.parts.toUpperCase()}</h4>
                        <div>Brand: ${e.currentModel.Brand}</div>
                        <div>Model: ${e.currentModel.Model}</div>
                    </div>
                `;
            }
        });

        // パフォーマンス描画
        config.pc.innerHTML += `
            <div class="d-flex justify-content-end p-3">
                <h3 class="mx-2">Game: ${Ctrl.calcGamePerformance(this)}</h3>
                <h3 class="mx-2">Work: ${Ctrl.calcWorkPerformance(this)}</h3>
            </div>
        `;
    }

    clearPC(){
        config.pc.innerHTML = "";
    }
}

class Ctrl {
    constructor() {}

    static setParts(view) {
        Ctrl.setCore(view);
        Ctrl.setRam(view);
        Ctrl.setStorage(view);
    }

    // CPU | GPU
    static setCore(view) {
        for (const ele of view.types) {
            if (ele.parts == "cpu" || ele.parts == "gpu") {
                // brand描画
                ele.drawBrand();

                // model描画
                ele.brandTag.addEventListener("change", (e) => {
                    ele.resetModel();
                    ele.setCurrentBrand(e.target.value);
                    ele.drawModel();
                });
                ele.modelTag.addEventListener("change", (e) => {
                    ele.setCurrentModel(e.target.value);
                    ele.checkCurrent();
                });
            }
        }
    }

    // Ram
    static setRam(view) {
        // ram取得
        const ram = view.types.filter((e) => e.parts == "ram").pop();

        // amount描画
        ram.drawAmount();

        // setBrand
        ram.amountTag.addEventListener("change", (e) => {
            // 初期化
            ram.resetBrand();
            ram.resetModel();

            ram.setCurrentAmount(e.target.value);
            ram.drawBrand();
        });

        // setModel
        ram.brandTag.addEventListener("change", (e) => {
            // 初期化
            ram.resetModel();

            ram.setCurrentBrand(e.target.value);
            ram.drawModel();
        });

        ram.modelTag.addEventListener("change", (e) => {
            ram.setCurrentModel(e.target.value);
            ram.checkCurrent();
        });
    }

    // storage
    static setStorage(view) {
        // storage取得
        const storage = view.types.filter((e) => e.parts == "storage").pop();

        // type描画
        storage.types.forEach((e) => {
            storage.typeTag.append(storage.createOption(e.parts.toUpperCase()));
        });

        // capacity描画
        storage.typeTag.addEventListener("change", (e) => {
            // 初期化
            storage.resetCapacity();
            storage.resetBrand();
            storage.resetModel();

            storage.setCurrentType(e.target.value);
            storage.drawCapacity();
        });

        // Brand描画
        storage.capacityTag.addEventListener("change", (e) => {
            // 初期化
            storage.resetBrand();
            storage.resetModel();

            storage.setCurrentCapacity(e.target.value);
            storage.drawBrand();
        });

        // Model描画
        storage.brandTag.addEventListener("change", (e) => {
            // 初期化
            storage.resetModel();

            storage.setCurrentBrand(e.target.value);
            storage.drawModel();
        });

        storage.modelTag.addEventListener("change", (e) => {
            storage.setCurrentModel(e.target.value);
            storage.checkCurrent();
        });
    }

    static calcGamePerformance(view) {
        const gamePerformance = Math.floor(
            view.types.reduce((pre, curr) => {
                switch (curr.parts) {
                    case "cpu":
                        return pre + curr.currentModel.Benchmark * 0.25;
                    case "gpu":
                        return pre + curr.currentModel.Benchmark * 0.6;
                    case "ram":
                        return pre + curr.currentModel.Benchmark * 0.125;
                    case "storage":
                        return pre + curr.currentModel.Benchmark * 0.025;
                }
            }, 0)
        );
        return gamePerformance;
    }

    static calcWorkPerformance(view) {
        const workPerformance = Math.floor(
            view.types.reduce((pre, curr) => {
                switch (curr.parts) {
                    case "cpu":
                        return pre + curr.currentModel.Benchmark * 0.6;
                    case "gpu":
                        return pre + curr.currentModel.Benchmark * 0.25;
                    case "ram":
                        return pre + curr.currentModel.Benchmark * 0.1;
                    case "storage":
                        return pre + curr.currentModel.Benchmark * 0.05;
                }
            }, 0)
        );
        return workPerformance;
    }
}

const view = new View();
view.init();

setTimeout(() => {
    Ctrl.setParts(view);
}, 100);
