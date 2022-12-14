
//only global mean window.xxx

const rand = () => 'ID' + (Math.random() * Date.now()).toString().replace('.', '')

const dup = (o) => JSON.parse(JSON.stringify(o))

const tim = () => Date.now() - window.timing

const sleep = m => new Promise((resolve) => setTimeout(() => {resolve()}, m))

const attr = (name, value) => {
    const attr = document.createAttribute(name)
    attr.value = value
    return attr
  }

const elmt = (name) => {
    return document.createElement(name)
}

const cnode = (type, attributes, data, content) => {
    const el = elmt(type)
    if (attributes ?? false) {
        Object.keys(attributes).forEach((row) => {
            el.setAttributeNode(attr(row, attributes[row]))
        })
    }
    if (data ?? false) {
        Object.keys(data).forEach((row) => {
            el.setAttributeNode(attr(`data-${row}`, data[row]))
        })
    }
    if (content ?? false) {
        el.textContent = content
    }
    return el
}

const gwidth = (el) => {
    const style = el.currentStyle || window.getComputedStyle(el),
        width = el.offsetWidth, // or use style.width
        margin = parseFloat(style.marginLeft) + parseFloat(style.marginRight),
        padding = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight),
        border = parseFloat(style.borderLeftWidth) + parseFloat(style.borderRightWidth);

    return width + margin - padding + border;    
}

const anode = async (id, type, attr, content) => {
    const el = document.getElementById(id).appendChild(cnode(type, attr))
        if(content !== undefined && content !== null){
            el.innerHTML = content
        }
    await Appz().then(async (appz) => {
        if(attr.hasOwnProperty('data-binded')){
            await appz.binded(el)
        }    
        if(attr.hasOwnProperty('data-binding')){
            await appz.binding(el)
        }
        if(attr.hasOwnProperty('data-binders')){
            await appz.binders(el)
        }
        if(attr.hasOwnProperty('data-action')){
            await appz.action(el)
        }
    })  
    
    return el
}

const traverse = async (id) => {
    await Appz().then(async (appz) => {
        //element that can init a state from json base64 encoded or files, first thing to check
        for await (const item of document.querySelectorAll(`#${id} [data-binders]`)) {
            await appz.binders(item)
        }
        //element that receive the state, third thing to check!!!
        for await (const item of document.querySelectorAll(`#${id} [data-binded]`)) {
            await appz.binded(item)
        }
        //element that can delete or change object from json input, fourth thing
        for await (const item of document.querySelectorAll(`#${id} [data-action]`)) {
            await appz.action(item)
        }
        //element that can delete or change object from json input, fourth thing
        for await (const item of document.querySelectorAll(`#${id} [data-binding]`)) {
            await appz.binding(item)
        }
    })
}

const jq = async () => {
    let count = 0;
    if(!window.jQuery){
        while(true){
            count++;
            //30 seconds max for fun
            if(count > 3000){
                return false
            }
            await sleep(100)
            if(window.jQuery){
                return true
            }
        }
    }
    return true
}

const popit = async (automatic) => {
    await Appz().then(async (appz) => {
        let prop;
        if(automatic){
            //get the automatic popup
            const name = await appz.gstates('popups.automatic');
            //our props
            prop = `popups.${name}`;
        }else{
            //get the current popup
            const current = await appz.gstates('popups.current');
            const sequence = await appz.gstates('popups.sequence');
            //increment or reset
            await appz.sstates('popups.current', (sequence[current + 1] === undefined) ? 0 : current + 1);
            //our props
            prop = `popups.${sequence[current]}`;
        }
        const container = 'popups-' + rand()
        await anode('body', 'div', {class: 'popup-container', id: container}, `
            <input type="hidden" value="${prop}" data-binders="@popups.json.php?prop=${prop}&uid=${container}">
            <div class="container wrap">
                <div class="response">
                    <span>Popups ${prop} Data:</span>
                    <div data-binded="${prop}"></div>
                    <button class="clear" data-action="delete" data-prop="${prop}">clear state</button>
                </div>
                <!-- basic popup binded + any we can use in the popup template to display informations -->
                <div class="text infos" data-binded="${prop}, interest.musics, personal" data-templated="@popups.html.php?prop=${prop}">
                    <div class="loading"></div>
                </div>
            </div>
        `)
        await traverse(container)
    })
}

const Appz = async () => {
    if(window.appz === undefined || window.appz === null){
        while(true){
            await sleep(10)
            if(window.appz !== undefined && window.appz !== null){
                return window.appz
            }
        }
    }
    return window.appz
}

//just some methods to test things

window.onClickable = async (ev, args) => {
    
    console.log('WINDOW.ONCLICKABLE:', {ev, args})
    
    await popit(false)
    
}

//EOF