import {
	Player
} from './Player.js'
export class GameWC extends HTMLElement {
	constructor(parent, props) {
		super();
		const template = document.getElementById('smp-game');
		this.root = template.content.firstElementChild.cloneNode(true);
		this.attachShadow({ mode: 'open' });
		console.log('rooy', this.root);
		this.props = props;
		this.parent = parent;
		this._data = {
			id: this.props.id,
			id: 5,
			seriesId: this.parent.dataset.series,
			players: this.props.playerRanks,
			isExpanded: false,
			selectedPlayerId: null
		}
		this.data;
		const collapsible = this.root.querySelector('.collapsible');
		collapsible.textContent = `Game ${this.id}`

		// const shadowRoot = this.attachShadow({ mode: 'open' }).appendChild(root.cloneNode(true));
		this.shadowRoot.appendChild(this.root);
		collapsible.addEventListener('click', this.handleBtnClick, false);

		// this.data.players.forEach(player => this.createPlayerElement(this.root, player))
		this.bindData()
		console.log('after binddata', this);
		//.bind(this)
	}

	get data() {
		// console.log(this.data);
		return this._data
	}
	set data(d) {
		// console.log(this.data);
		return this._data = d;
	}

	bindData() {
		console.log('poop');
		const collapsible = this.root.querySelector('.game-collapsible');
		const gameMapElement = this.root.querySelector('.game-map-name');
		const gameDateElement = this.root.querySelector('.game-date');

		collapsible.textContent = `Game ${this.id}`
		gameMapElement.textContent = this.mapName
		gameDateElement.textContent = this.date
	}

	get mapName() { return this.getAttribute('map') };
	get winner() { return this.getAttribute('winner') };
	get date() { return this.getAttribute('date') };
	get id() { return this.getAttribute('id') };




	playerSelected(e) {
		this.root.addEventListener('playerSelected', e => {
			this.data.selectedPlayerId =
				this.data.selectedPlayerId == e.detail.playerId ?
				null :
				e.detail.playerId;
			this.components.players
				.forEach(pl => { pl.selectedPlayerId = this.data.selectedPlayerId })
		})
	}

	handleBtnClick(e) {
		const gameBtn = e.target;
		// gameBtn.addEventListener('click', e => {
		console.log('clicker');
		const seriesContent = e.target.parentElement.parentElement.parentElement;
		const gameContent = e.target.nextElementSibling;
		gameBtn.classList.toggle('active');
		gameContent.classList.toggle('hide');

		const menubutton = seriesContent.querySelector('.series-menu');
		menubutton.classList.add('hide')

		let gameHeight = parseInt(gameContent.style.maxHeight.replace('px', ''))
		let seriesHeight = parseInt(seriesContent.style.maxHeight.replace('px', ''))

		if (gameHeight) {
			gameContent.style.maxHeight = 0; // 1) set it zero to reset series height
			gameContent.style.maxHeight = null; // 2) Set it null so it passes if condition
		} else {
			gameContent.style.maxHeight = gameContent.scrollHeight + "px";
			gameContent.style.zIndex = 30;
			seriesContent.style.zIndex = 30;

			if (gameContent.scrollHeight) {
				seriesContent.style.maxHeight = `${parseInt(seriesContent.style.maxHeight) + parseInt(gameContent.scrollHeight)}px`;
			} else {
				seriesContent.style.maxHeight = `${seriesContent.scrollHeight}px`;
			}
		}
		// })
	}

	createPlayerElement(listEl, player) {
		const pl = new Player(listEl, player);
		this.components.players.push(pl)

		return pl.render()
	}

	render() {
		this.root.classList.add(this.className)
		this.root.id = this.data.id;
		this.root.series = this.data.seriesId;
		this.root.insertAdjacentHTML('beforeend', this.template(this.props))

		const list = this.root.querySelector('.player-list')
		const gameBtn = this.root.querySelector('.game-collapsible')

		this.data.players
			.forEach(player => {
				list.appendChild(this.createPlayerElement(list, player))
			})

		this.handleBtnClick(gameBtn)
		this.playerSelected()

		return this.root;
	}

	connectedCallback() {
		console.log('connect');
		const collapsible = this.root.querySelector('.collapsible');

		collapsible.addEventListener('click', this.handleBtnClick, false);

		// browser calls this method when the element is added to the document
		// (can be called many times if an element is repeatedly added/removed)
	}

	disconnectedCallback() {
		// browser calls this method when the element is removed from the document
		// (can be called many times if an element is repeatedly added/removed)
	}

	static get observedAttributes() {
		return [ /* array of attribute names to monitor for changes */ ];
	}

	attributeChangedCallback(name, oldValue, newValue) {
		// called when one of attributes listed above is modified
	}

	adoptedCallback() {
		// called when the element is moved to a new document
		// (happens in document.adoptNode, very rarely used)
	}

	// there can be other element methods and properties

}
customElements.define('smp-game', GameWC);
// console.log('win',window.customElements.get('smp-game')); 
{ GameWC }