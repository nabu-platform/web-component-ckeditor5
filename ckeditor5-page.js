Vue.component("page-form-input-ckeditor5-configure", {
	template: "<div>"
		+ "	<n-form-switch v-model='field.useCmsAttachments' label='Use CMS attachments'/>"
		+ "	<n-form-switch v-model='field.useBase64' label='Use base64 embedded images'/>"
		+ "	<n-page-mapper v-model='field.bindings' :from='availableParameters' :to='field.useCmsAttachments ? [\"validator\", \"nodeId\"] : [\"validator\"]'/>"
		+ "</div>",
	props: {
		cell: {
			type: Object,
			required: true
		},
		page: {
			type: Object,
			required: true
		},
		field: {
			type: Object,
			required: true
		}
	},
	created: function() {
		if (!this.field.bindings) {
			Vue.set(this.field, "bindings", {});
		}
	},
	computed: {
		availableParameters: function() {
			return this.$services.page.getAvailableParameters(this.page, this.cell, true);
		}
	}
});

Vue.component("page-form-input-ckeditor5", {
	template: "<n-form-ckeditor5 ref='form'"
			+ "		:class=\"{'has-suffix-icon': !!field.suffixIcon, 'has-suffix': !!field.suffix }\""
			+ "		:edit='!readOnly'"
			+ "		:placeholder='placeholder'"
			+ "		:max-length='field.maxLength ? field.maxLength : null'"
			+ "		:min-length='field.minLength ? field.minLength : null'"
			+ "		:schema='schema'"
			+ "		:pattern-comment='field.regexLabel ? $services.page.translate(field.regexLabel) : null'"
			+ "		@input=\"function(newValue) { $emit('input', newValue) }\""
			+ "		:label='label'"
			+ "		:value='value'"
			+ "		:pattern='field.regex'"
			+ "		v-bubble:blur"
			+ "		:required='field.required'"
			+ "		:validator='getValidator()'"
			+ "		:info='field.info ? $services.page.translate(field.info) : null'"
			+ "		:before='field.before ? $services.page.translate(field.before) : null'"
			+ "		:after='field.after ? $services.page.translate(field.after) : null'"
			+ "		:suffix='field.suffixIcon ? $services.page.getIconHtml(field.suffixIcon) : field.suffix'"
			+ "		:minimum='field.minimum ? parseFloat($services.page.interpret(field.minimum, $self)) : null'"
			+ "		:maximum='field.maximum ? parseFloat($services.page.interpret(field.maximum, $self)) : null'"
			+ "		:step='field.step ? parseFloat($services.page.interpret(field.step, $self)) : null'"
			+ "		:name='field.name'"
			+ "		:timeout='timeout'"
			+ "		v-show='!hidden'"
			+ "		:show-custom-spinner='field.showCustomSpinner'"
			+ "		:disabled='disabled'/>",
	props: {
		cell: {
			type: Object,
			required: true
		},
		page: {
			type: Object,
			required: true
		},
		field: {
			type: Object,
			required: true
		},
		value: {
			required: true
		},
		label: {
			type: String,
			required: false
		},
		timeout: {
			required: false
		},
		disabled: {
			type: Boolean,
			required: false
		},
		schema: {
			type: Object,
			required: false
		},
		readOnly: {
			type: Boolean,
			required: false
		},
		placeholder: {
			type: String,
			required: false
		},
		codes: {
			required: false
		},
		hidden: {
			type: Boolean,
			required: false,
			default: false
		}
	},
	computed: {
		allCodes: function() {
			var codes = [];
			if (this.field.codes) {
				nabu.utils.arrays.merge(codes, this.field.codes);
			}
			if (this.codes) {
				nabu.utils.arrays.merge(codes, this.codes);
			}
			var result = {};
			var self = this;
			codes.forEach(function(code) {
				result[code.code] = self.$services.page.translate(code.title);
			});
			return result;
		},
		textType: function() {
			return this.field.textType ? this.field.textType : 'text';
		}
	},
	methods: {
		validate: function(soft) {
			return this.$refs.form.validate(soft);
		},
		getValidator: function() {
			if (this.field.bindings && this.field.bindings.validator) {
				var pageInstance = this.$services.page.getPageInstance(this.page, this);
				return this.$services.page.getBindingValue(pageInstance, this.field.bindings.validator, this);
			}
		}
	}
});


Vue.component("page-form-input-hidden", {
	template: "<page-form-input-text :cell='cell' :page='page' :field='field' :value='value' :label='label' :timeout='timeout' "
		+ ":disabled='disabled' :schema='schema' :read-only='readOnly' :placeholder='placeholder' :codes='codes' :hidden='true'/>",
	props: {
		cell: {
			type: Object,
			required: true
		},
		page: {
			type: Object,
			required: true
		},
		field: {
			type: Object,
			required: true
		},
		value: {
			required: true
		},
		label: {
			type: String,
			required: false
		},
		timeout: {
			required: false
		},
		disabled: {
			type: Boolean,
			required: false
		},
		schema: {
			type: Object,
			required: false
		},
		readOnly: {
			type: Boolean,
			required: false
		},
		placeholder: {
			type: String,
			required: false
		},
		codes: {
			required: false
		}
	}
});


window.addEventListener("load", function() {
	application.bootstrap(function($services) {
		nabu.page.provide("page-form-input", { 
			component: "page-form-input-ckeditor5", 
			configure: "page-form-input-ckeditor5-configure", 
			name: "ckeditor5",
			namespace: "nabu.page"
		});
	});
});