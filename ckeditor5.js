Vue.component("n-form-ckeditor5", {
	template: "#n-form-ckeditor5",
	props: {
		value: {
			type: String,
			required: true
		},
		edit: {
			type: Boolean,
			required: false,
			default: true
		},
		required: {
			type: Boolean,
			required: false,
			// explicitly set default value to null, otherwise vue will make it false which we can't distinguish from "not set"
			default: null
		},
		name: {
			type: String,
			required: false
		},
		placeholder: {
			type: String,
			required: false
		},
		// a json schema component stating the definition
		schema: {
			type: Object,
			required: false
		},
		pattern: {
			type: String,
			required: false
		},
		patternComment: {
			type: String,
			required: false
		},
		minLength: {
			type: Number,
			required: false
		},
		maxLength: {
			type: Number,
			required: false
		},
		codes: {
			required: false
		},
		timeout: {
			type: Number,
			required: false
		}
	},
	watch: {
		// reset validity if the value is updated
		value: function(newValue) {
			this.valid = null;
		}
	},
	ready: function() {
		var self = this;
		this.editor = ClassicEditor.create(this.$refs.editor, {
				autosave: {
					save: function(editor) {
						if (self.timer) {
							clearTimeout(self.timer);
						}
						var save = function() {
							self.$emit("input", self.editor.getData());
						}
						if (self.timeout) {
							self.timer = setTimeout(save, self.timeout);
						}
						else {
							save();
						}
					}
				}
			})
			.then(function(newEditor) {
				self.editor = newEditor;
			});
	},
	data: function() {
		return {
			messages: [],
			valid: null,
			timer: null,
			editor: null
		}
	},
	computed: {
		definition: function() {
			var definition = nabu.utils.vue.form.definition(this);
			if (this.type == "number") {
				definition.type = "number";
			}
			return definition;
		},
		mandatory: function() {
			return nabu.utils.vue.form.mandatory(this);
		}
	},
	methods: {
		validate: function(soft) {
			var valueToValidate = this.editor.getData();

			// reset current messages
			this.messages.splice(0);
			// this performs all basic validation and enriches the messages array to support asynchronous
			var messages = nabu.utils.schema.json.validate(this.definition, valueToValidate, this.mandatory);
			// add context to the messages to we can link back to this component
			for (var i = 0; i < messages.length; i++) {
				// components are vue-based entities that have recursive links to each other, the validation messages again etc
				// we don't want to include them in the enumerable properties cause this would prevent them from ever being serialized
				// we want to keep all state serializable and validations can become part of the state
				Object.defineProperty(messages[i], 'component', {
					value: this,
					enumerable: false
				});
			}
			
			// allow for custom validation
			messages = nabu.utils.vue.form.validateCustom(messages, valueToValidate, this.validator, this);

			var self = this;
			messages.then(function(validations) {
				
				nabu.utils.vue.form.rewriteCodes(messages, self.codes);

				// we want to separate out the info & warning messages, they should not be blocking and can be displayed alongside actual errors
				// currently the informational & warning messages are only ever shown on the component itself, not at the form level
				// this is why we are removing them from the actual messages array, they do not follow the component setting for errors (currently)
				var informational = messages.filter(function(x) { return x.severity != "error" });
				if (informational.length) {
					informational.forEach(function(x) {
						messages.splice(messages.indexOf(x), 1);
					});
				}

				self.messages.splice(0);
				var hardMessages = messages.filter(function(x) { return !x.soft });
				// if we are doing a soft validation and all messages were soft, set valid to unknown
				if (soft && hardMessages.length == 0 && (messages.length > 0 || !valueToValidate) && self.valid == null) {
					self.valid = null;
				}
				else {
					self.valid = messages.length == 0;
					nabu.utils.arrays.merge(self.messages, nabu.utils.vue.form.localMessages(self, messages));
				}
				// make sure we emit the value we just validated. in case of validate on blur (or a short validate timeout) and a longer emit timeout
				// we might be validating values that are not persisted, we can then browse to the next page without persisting it at all
				// don't send out a belated update
				if (self.timer) {
					clearTimeout(self.timer);
					self.timer = null;
				}
				// the original value can be undefined or null or an empty string
				// the valueToValidate can be any one of those too (realistically likely an empty string as we are talking about text fields)
				// to make sure we only update if it is relevant, we add this if
				// otherwise we "update" from undefined to an empty string for example which whill (after the validate) trigger the watcher which immediately resets the validation errors
				if (!(self.value == null && !valueToValidate)) {
					self.$emit("input", valueToValidate);
				}
				// if we have any informational messages, we want to show them locally
				if (informational.length) {
					nabu.utils.arrays.merge(self.messages, informational);
				}
			});
			return messages;
		}
	}
})