class newSpan extends HTMLElement () {
    constructor() {
        super();
        const body = document.getElementsByTagName("body")[0];
        this.shadow = body.attachShadow({mode: "open"});
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.shadow.innerHTML = `<span>0</span><br>`;
    }
}

window.customElements.define('my-span', newSpan);