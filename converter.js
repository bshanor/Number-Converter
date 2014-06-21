Ext.application({
	name   : 'Converter',

    launch : function() {
		//Constants
		this.NUMBERS = {
			ONES: {
				1: 'One',
				2: 'Two',
				3: 'Three',
				4: 'Four',
				5: 'Five',
				6: 'Six',
				7: 'Seven',
				8: 'Eight',
				9: 'Nine',
			},

			TENS: {
				1: 'Ten',
				2: 'Twenty',
				3: 'Thirty',
				4: 'Forty',
				5: 'Fifty',
				6: 'Sixty',
				7: 'Seventy',
				8: 'Eighty',
				9: 'Ninety',
			}
		};

		//Build UI
		var introPanel = Ext.create('Ext.Panel', {
			border: false,
			margin: '20 0 30 20',
			html: '<b>Number Converter</b><BR><BR>Accepts numbers between 0 and 999,999,999,999.99.<BR>Conversion occurs when button is clicked or Enter pressed in the entry field.<BR>Dollar signs, comma separators, and decimal point is optional.<BR>If there is a decimal point present, 2 digits must be to the right of it....in order for it to make cents.'
		});

        var btn = this.convertBtn = Ext.create('Ext.Button', {
			text: '<span style="font-size: medium;">Convert</span>',
			margin: '5',
			handler: Ext.bind(this.convert, this)
		});

		var btnContainer = Ext.create('Ext.Panel', {
		    anchor: '40%',
		    height: 60,
		    border: false,
		    layout: {
				type: 'hbox',
				pack: 'center'
			},
		    items: btn
        });

        var displayField = this.displayField = Ext.create('Ext.form.field.Display', {
			anchor: '100%',
			fieldLabel: '<b>Converted Value</b>',
			labelAlign: 'top'
		});

		var entryField = this.entryField = Ext.create('Ext.form.field.Text', {
			columnWidth: .4,
			fieldLabel: '<b>Enter an amount to convert</b>',
			labelAlign: 'top',
			allowBlank: false,
			blankText: 'Accepts numbers between 0 and 999,999,999,999.99.<BR>Dollar signs, comma separators, and decimal point is optional.<BR>If there is a decimal point present, 2 digits must be to the right of it....in order for it to make cents.',
			enableKeyEvents: true,
			regex: /^(\$|)(\d*)(\.\d{2})?$/,
			regexText: 'Accepts numbers between 0 and 999,999,999,999.99.<BR>Dollar signs, comma separators, and decimal point is optional.<BR>If there is a decimal point present, 2 digits must be to the right of it....in order for it to make cents.',
			listeners: {
				keydown: {
					fn: function(fld, evt) {
						if (evt.keyCode == 13) this.convert();
					},
					scope: this
				}
			}
		});

		var errField = this.errField = Ext.create('Ext.form.field.Display', {
			columnWidth: .6,
			margin: '20 0 0 10',
			hidden: true,
			value: '<span style="color: red;">Invalid Entry!</span>',
		});

		var entryPanel = Ext.create('Ext.Panel', {
			layout: 'column',
			anchor: '100%',
			border: false,
			items: [entryField, errField]
		});

        var mainPanel = this.mainPanel = Ext.create('Ext.form.Panel', {
            renderTo     : Ext.getBody(),
            draggable: false,
            bodyPadding  : 25,
            border: false,
            width: 700,
            layout: {
				type: 'anchor',
			},
			defaults: {margin: '0 0 0 20'},
			items: [introPanel, entryPanel, btnContainer, displayField]
        });
    },

    convert: function() {
		var form = this.mainPanel.getForm();
		var value = this.entryField.value;
		var sfx, v, bil, mil, k, h;

		if (!form.isValid()) {
			this.errField.show();
			return;
		}

		this.errField.hide();
		this.result = [];
		this.displayField.setValue('');

		var testExp = /^(\$|)(\d*)(\.\d{2})?$/;
		value = value.replace(/[\,\$]/g, '');

		if (testExp.test(value)) {
			if (value.indexOf('.') > -1) {
				sfx = 'and ' + value.slice(-2) + '/100';

				value = value.slice(0, -3);
			} else {
				sfx = 'and 00/100';
			}
			value = value == ''? '0': value;

			if (value.length == 1) {
				if (value == '0') {
					this.displayField.setValue('Zero ' + sfx);
				} else {
					this.displayField.setValue(this.NUMBERS.ONES[value] + ' ' + sfx);
				}
			} else {
				v = value.split('').reverse();

				bil = Ext.Array.slice(v, 9, 12).length > 0? Ext.Array.slice(v, 9, 12): false;
				mil = Ext.Array.slice(v, 6, 9).length > 0? Ext.Array.slice(v, 6, 9): false;
				k = Ext.Array.slice(v, 3, 6).length > 0? Ext.Array.slice(v, 3, 6): false;
				h = Ext.Array.slice(v, 0, 3).length > 0? Ext.Array.slice(v, 0, 3): false;

				Ext.Array.insert(this.result, 0, this.renderText(h, null));
				if (k) Ext.Array.insert(this.result, 0, this.renderText(k, 'Thousand'));
				if (mil) Ext.Array.insert(this.result, 0, this.renderText(mil, 'Million'));
				if (bil) Ext.Array.insert(this.result, 0, this.renderText(bil, 'Billion'));

				this.result.push(sfx);

				this.displayField.setValue(this.result.join(' ').replace(/- /g, '-'));
			}
		}
	},

	renderText: function(arr, index) {
		var ret = [], tmp;

		if(arr[0]) {
			if (arr[0] > 0) Ext.Array.insert(ret, 0, [this.NUMBERS.ONES[arr[0]]]);
		}

		if (arr[1] && arr[1] > 0) {
			tmp = this.NUMBERS.TENS[arr[1]] + (arr[0] > 0? '-': '');
			Ext.Array.insert(ret, 0, [tmp]);
		}

		if (arr[2] && arr[2] > 0) {
			tmp = this.NUMBERS.ONES[arr[2]] + ' Hundred';
			Ext.Array.insert(ret, 0, [tmp]);
		}

		if (index && ret.length > 0) ret.push(index);

		return ret;
	}
});