
//scope the block to control the access on methods and objects

!(async () => {
	
	const D2cMustache = async () => {
		
		var objectToString = Object.prototype.toString, isArray = Array.isArray || function (a) {
			return "[object Array]" === objectToString.call(a)
		};
		
		function isFunction(a) {
			return "function" == typeof a
		}
		
		function typeStr(a) {
			return isArray(a) ? "array" : typeof a
		}
		
		function escapeRegExp(a) {
			return a.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&")
		}
		
		function hasProperty(a, b) {
			return null != a && "object" == typeof a && b in a
		}
		
		function primitiveHasOwnProperty(a, b) {
			return null != a && "object" != typeof a && a.hasOwnProperty && a.hasOwnProperty(b)
		}
		
		var regExpTest = RegExp.prototype.test;
		
		function testRegExp(a, b) {
			return regExpTest.call(a, b)
		}
		
		var nonSpaceRe = /\S/;
		
		function isWhitespace(a) {
			return !testRegExp(nonSpaceRe, a)
		}
		
		var entityMap = {
			"&": "&amp;",
			"<": "&lt;",
			">": "&gt;",
			'"': "&quot;",
			"'": "&#39;",
			"/": "&#x2F;",
			"`": "&#x60;",
			"=": "&#x3D;"
		};
		
		function escapeHtml(a) {
			return (a + "").replace(/[&<>"'`=\/]/g, function (a) {
				return entityMap[a]
			})
		}
		
		var whiteRe = /\s*/, spaceRe = /\s+/, equalsRe = /\s*=/, curlyRe = /\s*\}/, tagRe = /#|\^|\/|>|\{|&|=|!/;
		
		function parseTemplate(a, b) {
			function c() {
				if (m && !n) for (; l.length;) delete k[l.pop()]; else l = [];
				m = !1, n = !1
			}
			
			function d(a) {
				if ("string" == typeof a && (a = a.split(spaceRe, 2)), !isArray(a) || 2 !== a.length) throw new Error("Invalid tags: " + a);
				e = new RegExp(escapeRegExp(a[0]) + "\\s*"), f = new RegExp("\\s*" + escapeRegExp(a[1])), g = new RegExp("\\s*" + escapeRegExp("}" + a[1]))
			}
			
			if (!a) return [];
			var e, f, g, h = !1, j = [], k = [], l = [], m = !1, n = !1, o = "", p = 0;
			d(b || mustache.tags);
			for (var q, r, s, t, u, v, w = new Scanner(a); !w.eos();) {
				if (q = w.pos, s = w.scanUntil(e), s) for (var x = 0, y = s.length; x < y; ++x) t = s.charAt(x), isWhitespace(t) ? (l.push(k.length), o += t) : (n = !0, h = !0, o += " "), k.push(["text", t, q, q + 1]), q += 1, "\n" === t && (c(), o = "", p = 0, h = !1);
				if (!w.scan(e)) break;
				if (m = !0, r = w.scan(tagRe) || "name", w.scan(whiteRe), "=" === r ? (s = w.scanUntil(equalsRe), w.scan(equalsRe), w.scanUntil(f)) : "{" === r ? (s = w.scanUntil(g), w.scan(curlyRe), w.scanUntil(f), r = "&") : s = w.scanUntil(f), !w.scan(f)) throw new Error("Unclosed tag at " + w.pos);
				if (u = ">" == r ? [r, s, q, w.pos, o, p, h] : [r, s, q, w.pos], p++, k.push(u), "#" === r || "^" === r) j.push(u); else if ("/" === r) {
					if (v = j.pop(), !v) throw new Error("Unopened section \"" + s + "\" at " + q);
					if (v[1] !== s) throw new Error("Unclosed section \"" + v[1] + "\" at " + q)
				} else "name" === r || "{" === r || "&" === r ? n = !0 : "=" === r && d(s)
			}
			if (c(), v = j.pop(), v) throw new Error("Unclosed section \"" + v[1] + "\" at " + w.pos);
			return nestTokens(squashTokens(k))
		}
		
		function squashTokens(a) {
			for (var b, c, d = [], e = 0, f = a.length; e < f; ++e) b = a[e], b && ("text" === b[0] && c && "text" === c[0] ? (c[1] += b[1], c[3] = b[3]) : (d.push(b), c = b));
			return d
		}
		
		function nestTokens(a) {
			for (var b, c, d = [], e = d, f = [], g = 0, h = a.length; g < h; ++g) switch (b = a[g], b[0]) {
				case"#":
				case"^":
					e.push(b), f.push(b), e = b[4] = [];
					break;
				case"/":
					c = f.pop(), c[5] = b[2], e = 0 < f.length ? f[f.length - 1][4] : d;
					break;
				default:
					e.push(b);
			}
			return d
		}
		
		function Scanner(a) {
			this.string = a, this.tail = a, this.pos = 0
		}
		
		Scanner.prototype.eos = function () {
			return "" === this.tail
		}, Scanner.prototype.scan = function (a) {
			var b = this.tail.match(a);
			if (!b || 0 !== b.index) return "";
			var c = b[0];
			return this.tail = this.tail.substring(c.length), this.pos += c.length, c
		}, Scanner.prototype.scanUntil = function (a) {
			var b, c = this.tail.search(a);
			return -1 === c ? (b = this.tail, this.tail = "") : 0 === c ? b = "" : (b = this.tail.substring(0, c), this.tail = this.tail.substring(c)), this.pos += b.length, b
		};
		
		function Context(a, b) {
			this.view = a, this.cache = {".": this.view}, this.parent = b
		}
		
		Context.prototype.push = function (a) {
			return new Context(a, this)
		}, Context.prototype.lookup = function (a) {
			var b, c = this.cache;
			if (c.hasOwnProperty(a)) b = c[a]; else {
				for (var d, e, f, g = this, h = !1; g;) {
					if (0 < a.indexOf(".")) for (d = g.view, e = a.split("."), f = 0; null != d && f < e.length;) f === e.length - 1 && (h = hasProperty(d, e[f]) || primitiveHasOwnProperty(d, e[f])), d = d[e[f++]]; else d = g.view[a], h = hasProperty(g.view, a);
					if (h) {
						b = d;
						break
					}
					g = g.parent
				}
				c[a] = b
			}
			return isFunction(b) && (b = b.call(this.view)), b
		};
		
		function Writer() {
			this.templateCache = {
				_cache: {}, set: function (a, b) {
					this._cache[a] = b
				}, get: function (a) {
					return this._cache[a]
				}, clear: function () {
					this._cache = {}
				}
			}
		}
		
		Writer.prototype.clearCache = function () {
			"undefined" != typeof this.templateCache && this.templateCache.clear()
		}, Writer.prototype.parse = function (a, b) {
			var c = this.templateCache, d = a + ":" + (b || mustache.tags).join(":"), e = "undefined" != typeof c,
				f = e ? c.get(d) : void 0;
			return null == f && (f = parseTemplate(a, b), e && c.set(d, f)), f
		}, Writer.prototype.render = function (a, b, c, d) {
			var e = this.getConfigTags(d), f = this.parse(a, e), g = b instanceof Context ? b : new Context(b, void 0);
			return this.renderTokens(f, g, c, a, d)
		}, Writer.prototype.renderTokens = function (a, b, c, d, e) {
			for (var f, g, h, j = "", k = 0, l = a.length; k < l; ++k) h = void 0, f = a[k], g = f[0], "#" === g ? h = this.renderSection(f, b, c, d, e) : "^" === g ? h = this.renderInverted(f, b, c, d, e) : ">" === g ? h = this.renderPartial(f, b, c, e) : "&" === g ? h = this.unescapedValue(f, b) : "name" === g ? h = this.escapedValue(f, b, e) : "text" === g && (h = this.rawValue(f)), void 0 !== h && (j += h);
			return j
		}, Writer.prototype.renderSection = function (a, b, c, d, e) {
			function f(a) {
				return g.render(a, b, c, e)
			}
			
			var g = this, h = "", i = b.lookup(a[1]);
			if (i) {
				if (isArray(i)) for (var k = 0, l = i.length; k < l; ++k) h += this.renderTokens(a[4], b.push(i[k]), c, d, e); else if ("object" == typeof i || "string" == typeof i || "number" == typeof i) h += this.renderTokens(a[4], b.push(i), c, d, e); else if (isFunction(i)) {
					if ("string" != typeof d) throw new Error("Cannot use higher-order sections without the original template");
					i = i.call(b.view, d.slice(a[3], a[5]), f), null != i && (h += i)
				} else h += this.renderTokens(a[4], b, c, d, e);
				return h
			}
		}, Writer.prototype.renderInverted = function (a, b, c, d, e) {
			var f = b.lookup(a[1]);
			if (!f || isArray(f) && 0 === f.length) return this.renderTokens(a[4], b, c, d, e)
		}, Writer.prototype.indentPartial = function (a, b, c) {
			for (var d = b.replace(/[^ \t]/g, ""), e = a.split("\n"), f = 0; f < e.length; f++) e[f].length && (0 < f || !c) && (e[f] = d + e[f]);
			return e.join("\n")
		}, Writer.prototype.renderPartial = function (a, b, c, d) {
			if (c) {
				var e = this.getConfigTags(d), f = isFunction(c) ? c(a[1]) : c[a[1]];
				if (null != f) {
					var g = a[6], h = a[5], i = a[4], j = f;
					0 == h && i && (j = this.indentPartial(f, i, g));
					var k = this.parse(j, e);
					return this.renderTokens(k, b, c, j, d)
				}
			}
		}, Writer.prototype.unescapedValue = function (a, b) {
			var c = b.lookup(a[1]);
			if (null != c) return c
		}, Writer.prototype.escapedValue = function (a, b, c) {
			var d = this.getConfigEscape(c) || mustache.escape, e = b.lookup(a[1]);
			if (null != e) return "number" == typeof e && d === mustache.escape ? e + "" : d(e)
		}, Writer.prototype.rawValue = function (a) {
			return a[1]
		}, Writer.prototype.getConfigTags = function (a) {
			return isArray(a) ? a : a && "object" == typeof a ? a.tags : void 0
		}, Writer.prototype.getConfigEscape = function (a) {
			return a && "object" == typeof a && !isArray(a) ? a.escape : void 0
		};
		var mustache = {
			name: "mustache.js",
			version: "4.2.0",
			tags: ["{{", "}}"],
			clearCache: void 0,
			escape: void 0,
			parse: void 0,
			render: void 0,
			Scanner: void 0,
			Context: void 0,
			Writer: void 0,
			set templateCache(a) {
				defaultWriter.templateCache = a
			},
			get templateCache() {
				return defaultWriter.templateCache
			}
		}, defaultWriter = new Writer;
		mustache.clearCache = function () {
			return defaultWriter.clearCache()
		}, mustache.parse = function (a, b) {
			return defaultWriter.parse(a, b)
		}, mustache.render = function (a, b, c, d) {
			if ("string" != typeof a) throw new TypeError("Invalid template! Template should be a \"string\" but \"" + typeStr(a) + "\" was given as the first argument for mustache#render(template, view, partials)");
			return defaultWriter.render(a, b, c, d)
		}, mustache.escape = escapeHtml, mustache.Scanner = Scanner, mustache.Context = Context, mustache.Writer = Writer;
		
		return mustache;
		
	}
	
	const D2cStates = async () => {
		
		const prefix = '@'
		let states = {}
		let registered = {}
		let undos = []
		let observables = {}
		
		async function setStates(prop, value, nosave, noupdated) {
			await sleep(0)
			if (states) {
				if (nosave === undefined) {
					_save(prop)
				}
				const rtn = Function('states', 'value', `
					"use strict";
					try{
						//if at same props merge them to keep that all and overwrite by the newest
						//in ca an array or object was passed
						states.${prop} = ['object', 'array'].indexOf(typeof value) !== -1 && typeof states.${prop} === 'object' ?
							{...states.${prop}, ...value} : value;
					}catch(e){
						//the object didnt exist so will create it
						const rb = (s, a, v) => {
							let it = a.shift();
							if(a.length){
								if(s[it] === undefined || s[it] === null){
									s[it] = {};
								}
								rb(s[it], a, v);
							}else{
								s[it] = value;
							}
						}
						try{
							rb(states, '${prop}'.split('.'), value);
						}catch(e){
							console.log('ERROR:', e);
							return null;
						}
						return true;
					}
					return true;
				`)(states, value)
				if (rtn) {
					if (noupdated === undefined) {
						_updated(prop, value)
					}
					return rtn
				}
				console.error('STATE-NOT-UPDATED', rtn, states);
				return null
			}
			return null
		}
		
		async function delStates(prop) {
			await sleep(0)
			if (states) {
				_save(prop)
				const rtn = Function('states', 'value', `
					"use strict";
					try{
						if('${prop}' === 'undefined'){
							states = {}
						}else{
							delete states.${prop}
						}
					}catch(e){
						console.log('ERROR:', e);
						return false;
					}
					return true;
				`)(states)
				if (rtn) {
					_deleted(prop)
					return rtn
				}
				console.error('STATE-NOT-DELETED', rtn, states);
				return null
			}
			return null
		}
		
		function getStates(name) {
			if (states) {
				if (!arguments.length) {
					return states
				}
				return (
					Function('states', `
						"use strict";
						try{
							return states.${name};
						}catch(e){
							return null;
						}
					`)(states) ?? null
				)
			}
			return null
		}
		
		function register(prop, uid, cb) {
			prop = `${prefix}${prop}`
			if (registered[prop] === undefined) {
				registered[prop] = {};
			}
			registered[prop][uid] = cb
		}
		
		function unregister(uids) {
			uids = typeof uids === 'string' ? [uids] : uids
			//remove the elements
			uids.forEach((uid) => {
				Object.keys(registered).forEach((prop) => {
					if (registered[prop][uid] !== undefined) {
						console.log('UNREGISTER:', uid)
						delete registered[prop][uid]
					}
				})
			})
			//remove the keys if no element in item
			Object.keys(registered).forEach((prop) => {
				if (!Object.keys(registered[prop]).length) {
					delete registered[prop]
				}
			})
		}
		
		function observe(prop, cb) {
			prop = `${prefix}${prop}`
			if (observables[prop] === undefined) {
				observables[prop] = [];
			}
			observables[prop].push(cb)
			//return position to remove the observer
			return observables[prop].length - 1
		}
		
		function robserve(prop, pos) {
			//will do better next time with name instead maybe
			//for now null is enough, it will clean the event reference
			try {
				observables[`${prefix}${prop}`][pos] = null
			} catch (e) {
				//console.warn('')
			}
		}
		
		function _deleted(prop) {
			//console.log('STATE-DELETED', {prop, states, registered});
			let keys = Object.keys(registered).filter((k) => {
				return (new RegExp(`${prefix}${prop}`)).test(k);
			});
			if (keys.length) {
				keys.forEach((k) => {
					Object.keys(registered[k]).forEach((item) => registered[k][item](getStates(k.replace(prefix, ''))))
				})
			}
			keys = Object.keys(observables).filter((k) => {
				return (new RegExp(`${prefix}${prop}`)).test(k);
			});
			if (keys.length) {
				keys.forEach((k) => {
					observables[k].forEach((f) => {
						if (typeof f === 'function') {
							f(getStates(k.replace(prefix, '')), prop)
						}
					})
				})
			}
		}
		
		function _updated(prop, value) {
			console.log('STATE-UPDATED', {prop, value, states, registered, undos, observables});
			if (prop.indexOf('.') !== -1) {
				const rb = (a, s) => {
					let it = a.shift();
					s += !s.length ? it : `.${it}`
					let k = `${prefix}${s}`
					let gs = null
					if (typeof registered[k] === 'object') {
						Object.keys(registered[k]).forEach((item) => registered[k][item](getStates(s)))
					}
					if (typeof observables[k] === 'object') {
						observables[k].forEach((f) => {
							//some observables maybe set at null to remove his listener event reference
							if (typeof f === 'function') {
								//will also send the base prop that was changed for more control on js side
								f(gs ?? getStates(s), prop)
							}
						})
					}
					if (a.length) {
						rb(a, s);
					}
				}
				rb(prop.split('.'), '')
			} else {
				let k = `${prefix}${prop}`
				let gs = null
				if (typeof registered[k] === 'object') {
					gs = getStates(prop);
					Object.keys(registered[k]).forEach((item) => registered[k][item](gs))
				}
				if (typeof observables[k] === 'object') {
					observables[k].forEach((f) => {
						if (typeof f === 'function') {
							f(gs ?? getStates(prop), prop)
						}
					})
				}
			}
		}
		
		function _save(prop) {
			try {
				let s = getStates(prop)
				//TODO: type marital B, clear, type marital B, clear, than Undo
				//So if the object wasnt there the return is null so we are missing the first A when undoiing
				//because that property didnt exist at first before writing the data which creates that prop it
				//so it must come from an input which is a string, in that case we will create the object with empty data
				//NO null because null is an object in JS
				if (s !== null) {
					undos.push({
						prop,
						json: typeof s === 'object' ? {...s} : s
					})
				}
			} catch (e) {
				console.error(e)
			}
		}
		
		async function undoStates() {
			try {
				if (undos.length) {
					const undo = undos.pop()
					if (undo.prop !== undefined && undo.json !== undefined) {
						setStates(undo.prop, undo.json, true, true).then((r) => {
							let keys = Object.keys(registered).filter((k) => {
								return (new RegExp(`${prefix}${undo.prop}`)).test(k);
							});
							if (keys.length) {
								keys.forEach((k) => {
									Object
										.keys(registered[k])
										.forEach((item) => registered[k][item](getStates(k.replace(prefix, ''))))
								})
							}
							keys = Object.keys(observables).filter((k) => {
								return (new RegExp(`${prefix}${undo.prop}`)).test(k);
							});
							if (keys.length) {
								keys.forEach((k) => {
									observables[k].forEach((f) => {
										if (typeof f === 'function') {
											f(getStates(k.replace(prefix, '')), undo.prop)
										}
									})
								})
							}
						})
					}
				}
			} catch (e) {
				console.error(e)
			}
		}
		
		return {setStates, getStates, delStates, undoStates, register, unregister, observe, robserve}
		
	};
	
	const D2cIndex = async () => {
		
		//load import async
		const _load = async (name) => {
			return new Promise((resolve, reject) => {
				import(`/js/modules/${name}.mjs`).then((s) => {
					resolve(s)
				}).catch((e) => {
					reject(e)
				});
			})
		}
		
		//load file data async
		const _data = async (f) => {
			return new Promise((resolve, reject) => {
				try {
					fetch((new URL(`/data/${f}`, window.top.location)).href).then((e) => {
						if (200 !== e.status) {
							reject()
						}
						resolve(e.json());
					}).catch((e) => {
						reject(e)
					});
				} catch (e) {
					reject(e)
				}
			})
		}
		
		//load the html template
		const _template = async (f) => {
			return new Promise((resolve, reject) => {
				try {
					fetch((new URL(`/template/${f}`, window.top.location)).href)
						.then((response) => {
							if (200 !== response.status) {
								reject()
							}
							resolve(response.text())
						}).catch((e) => {
						reject(e)
					});
				} catch (e) {
					reject(e)
				}
			})
		}
		
		//check if element still there
		const _garbage = async () => {
			return new Promise((resolve, reject) => {
				if (!bindedElementIds.length) {
					resolve()
				}
				//let removed = []
				//get all present ids
				const present = [];
				document.querySelectorAll("[data-uid]").forEach((el) => {
					present.push(el.dataset.uid)
				})
				const dif = diff(present, bindedElementIds)
				if (dif.length) {
					//removeed from binded listener
					ModStates.unregister(dif)
					//remove from the stack
					bindedElementIds = intersect(present, bindedElementIds)
					//sopme debug
					console.log('BINDEDELEMENTIDS:', {bindedElementIds})
				}
				resolve()
			})
		}
		
		//main module for states
		
		const ModStates = await D2cStates()
		const ModMustache = await D2cMustache()
		
		let bindedElementIds = []
		
		const binded = async (item) => {
			if (item.dataset.isbinded !== undefined) {
				return
			}
			const uid = rand()
			item.dataset.uid = uid
			item.dataset.isbinded = 1
			const bindd = item.dataset.binded
			const tpl = item.dataset.templated
			const type = item.tagName
			let template = null
			//get the template from html template or base64 values
			if (tpl !== undefined) {
				if (tpl.indexOf('#') !== -1) {
					template = document.querySelector(`template[data-template="${tpl.replace('#', '')}"]`).innerHTML
				} else if (tpl.indexOf('@') !== -1) {
					template = await _template(tpl.replace('@', ''))
				} else {
					template = atob(tpl)
				}
			}
			//cache the template
			if (template !== null) {
				//console.log(`"TEMPLATE[${tpl}]`, template)
				ModMustache.parse(template)
			}
			//view redering on load and states modifications
			const render = (v) => {
				switch (type) {
					case 'INPUT':
						item.value = typeof v === 'string' ? v : ''
						break
					default:
						if (v === null) {
							item.innerHTML = ''
						}
						if (template !== null) {
							//just testing smaller object OR maybe will use the complete ModStates.geStates() instead
							//get the needed states for that template to work
							let st = {}
							bindd.split(',').forEach((prop) => {
								prop = prop.trim()
								let tmp = ModStates.getStates(prop)
								if (prop.indexOf('.') !== -1) {
									const create = (s, a) => {
										let it = a.shift();
										if (a.length) {
											if (s[it] === undefined) {
												s[it] = {};
											}
											create(s[it], a);
										} else {
											s[it] = tmp
										}
									}
									create(st, prop.split('.'))
								} else {
									st[prop] = tmp
								}
							})
							//use the created states and use that template to render it
							item.innerHTML = ModMustache.render(template, st)
						} else {
							//just display the object as string
							item.innerHTML = JSON.stringify(v)
						}
						break
				}
			}
			//states observer listener whatever
			bindd.split(',').forEach((prop) => {
				prop = prop.trim()
				const state = prop.length ? ModStates.getStates(prop) : ModStates.getStates()
				if (state !== null) {
					render(state)
				}
				ModStates.register(prop, uid, (v) => render(v))
			})
			//some observer on mutations
			bindedElementIds.push(uid)
		}
		
		const binders = async (item) => {
			
			//@NOTES: some test console linear since its a promise
			// window.appz.gstates('test').then((r)=>console.log(r));
			
			try {
				if (item.dataset.isbinders !== undefined) {
					return
				}
				item.dataset.isbinders = 1
				let obj = null
				const bd = item.dataset.binders
				//if its not comning fomr an INPUT[value] but from a another kind of tag
				let value = item.value ?? null
				if (bd.indexOf('@') !== -1) {
					//it is coming from an url
					obj = await _data(bd.replace('@', ''))
				} else if (bd.indexOf('#') !== -1) {
					//for those we need to read the attibute not like an INPUT[value]
					value = item.dataset.value
					//it is coming the content text of that element
					//nothing is in de data-binders attribute excpt the #
					obj = JSON.parse(item.textContent)
				} else {
					//it is inside de data-binders attribute base64 encoded
					obj = JSON.parse(atob(bd))
				}
				if (obj.hasOwnProperty('functions')) {
					//convert it to to real function
					Object.keys(obj.functions).forEach((k) => {
						//get eh string functions
						let func = obj.functions[k]
						//console.log(`FUNCTION-MAPPING[${k}]:\n ${func} \n`)
						//remap to real functionnal functions
						//where func could be : ' return "<i>" + render(text) + "</i>"; '
						obj.functions[k] = () => (text, render) => {
							return Function('render', 'text', `
								"use strict";
								//console.log(render, text);
								${func};
							`)(render, text)
						}
					})
				}
				await ModStates.setStates(value, obj)
			} catch (e) {
				console.error(e)
			}
		}
		
		const binding = async (item) => {
			if (item.dataset.isbinding !== undefined) {
				return
			}
			item.dataset.isbinding = 1
			const prop = item.dataset.binding
			//we have some so update the prop but do not save the rollback
			if (item.value.length) {
				await ModStates.setStates(prop, item.value, true)
			} else {
				//we have none so check the states if we have one use that value
				const state = ModStates.getStates(prop)
				if (state !== null) {
					item.value = state
				}
			}
			item.oninput = async (ev) => await ModStates.setStates(prop, ev.target.value)
		}
		
		const action = async (item) => {
			if (item.dataset.isaction !== undefined) {
				return
			}
			item.dataset.isaction
			const action = item.dataset.action
			const prop = item.dataset.prop
			//we have some so update the main
			switch (action) {
				case 'delete':
					item.onclick = async (ev) => await ModStates.delStates(prop)
					break;
				case 'undo':
					item.onclick = async (ev) => await ModStates.undoStates()
					break;
				default:
					break;
			}
		}
		
		const gstates = async (p) => {
			return await ModStates.getStates(p)
		}
		
		const sstates = async (p, v) => {
			await ModStates.setStates(p, v)
		}
		
		const obsstates = async (prop, cb) => {
			return ModStates.observe(prop, cb)
		}
		
		const robsstates = async (prop, pos) => {
			return ModStates.robserve(prop, pos)
		}
		
		(async () => {
			console.log('STARTER-STATES', {
				states: await ModStates.getStates(),
				ModMustache
			})
		})();
		
		(async () => {
			let collect = async () => {
				//check the elemnt not there anymore
				await _garbage()
				await sleep(10000)
				collect()
			}
			await sleep(10000)
			collect();
		})();
		
		return {binded, binders, binding, action, gstates, sstates, obsstates, robsstates};
		
	};
	
	D2cIndex().then(async (obj) => {
		//element that can init a state from json base64 encoded or files, first thing to check
		for await (const item of document.querySelectorAll('[data-binders]')) {
			await obj.binders(item)
		}
		//element that cam modify the state, second thing to check
		for await (const item of document.querySelectorAll('[data-binding]')) {
			await obj.binding(item)
		}
		//element that receive the state, third thing to check!!!
		for await (const item of document.querySelectorAll('[data-binded]')) {
			await obj.binded(item)
		}
		//element that can delete or change object from json input, fourth thing
		for await (const item of document.querySelectorAll('[data-action]')) {
			await obj.action(item)
		}
		//finally map it
		window.appz = obj;
	});
	
})();