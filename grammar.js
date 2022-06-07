module.exports = grammar({
    name: 'formula',
    extras: $ => [
        /\s/,
        $.comment
    ],
    word: $ => $.bareid,
    rules: {
        program: $ => choice(
            $.module,
            /\n/
        ),
        module: $ => seq($.machine, /\n/),
        machine: $ => seq($.machine_sig, $.lcbrace, $.machine_body, $.rcbrace),
        machine_sig: $ => seq($.machineid, $.bareid, $.machine_sig_in, $.of, $.bareid),
        machine_sig_in: $ => seq($.lparen, $.rparen),
        machine_body: $ => seq($.machine_sentence, repeat($.machine_sentence)),
        sentence_config: $ => seq($.lsbrace, $.setting, $.rsbrace),
        setting: $ => seq($.id, $.eq, $.constant),
        machine_sentence: $ => choice(
            seq($.machine_prop, $.dot),
            seq($.boot, $.update, $.dot),
            seq($.initially, $.update, $.dot),
            seq($.next, $.update, $.dot)
        ),
        update: $ => seq($.id, $.eq, $.bareid, $.lparen, $.bareid, $.rparen),
        machine_prop: $ => seq($.property, $.bareid, $.eq, $.id),
        id: $ => choice($.bareid, $.qualid),
        dot: $ => /\./,
        bareid: $ => {
            const alpha = /[^\x00-\x1F\s\p{Zs}0-9:;`"'@#.,|^&<=>+\-*/\\%?!~()\[\]{}\uFEFF\u2060\u200B]|\\u[0-9a-fA-F]{4}|\\u\{[0-9a-fA-F]+\}/
            const alphanumeric = /[^\x00-\x1F\s\p{Zs}:;`"'@#.,|^&<=>+\-*/\\%?!~()\[\]{}\uFEFF\u2060\u200B]|\\u[0-9a-fA-F]{4}|\\u\{[0-9a-fA-F]+\}/
            return token(seq(alpha, repeat(alphanumeric)))
        },
        qualid: $ => token(/%[A-Za-z_]\w*'*(\.[A-Za-z_]\w*'*)+/),
        is: $ => /is\s/,
        no: $ => /no\s/,
        mul: $ => /\*/,
        div: $ => /\//,
        mod: $ => /%/,
        plus: $ => /\+/,
        minus: $ => /\-/,
        pipe: $ => /\|/,
        lcbrace: $ => /\{/,
        rcbrace: $ => /}/,
        lsbrace: $ => /\[/,
        rsbrace: $ => /\]/,
        lparen: $ => /\(/,
        rparen: $ => /\)/,
        renames: $ => /::/,
        range: $ => /\.\./,
        semicolon: $ => /;/,
        colon: $ => /:/,
        eq: $ => /=/,
        comma: $ => /,/,
        digits: $ => /[0-9]+/,
        real: $ => /[0-9]+\.[0-9]+/,
        frac: $ => /[0-9]+\/[-+]?[0]*[1-9][0-9]*/,
        ne: $ => /!=/,
        lt: $ => /</,
        le: $ => /<=/,
        gt: $ => />/,
        ge: $ => />=/,
        relop: $ => choice(
            $.eq,
            $.ne,
            $.lt,
            $.le,
            $.gt,
            $.ge
        ),
        constant: $ => choice(
            $.digits,
            seq($.minus, $.digits),
            seq($.plus, $.digits),
            $.real,
            seq($.minus, $.real),
            seq($.plus, $.real),
            $.frac,
            seq($.minus, $.frac),
            seq($.plus, $.frac),
            $.str
        ),
        domainid: $ => /domain/,
        property: $ => /property/,
        machineid: $ => /machine/,
        boot: $ => /boot/,
        next: $ => prec.right(5,/next/),
        initially: $ => prec.right(5,/initially/),
        at: $ => /at/,
        of: $ => /of/,
        str: $ => choice($.string, $.string_mul),
        string: $ => seq('"', optional(repeat1(choice($.esc, /~([\r\n])/))),'"'),
        string_mul: $ => seq('\'"', optional(repeat1(choice($.mul_esc, /./))),'"\''),
        esc: $ => choice(
            '\\"',
            '\\\\',
            '\\r',
            '\\n',
            '\\t'
        ),
        mul_esc: $ => choice(
            '\'\'""',
            '""\'\''
        ),
        comment: $ => token(choice(
            seq('//', /.*/),
            seq(
                '/*',
                repeat(choice(
                    /[^*]/,
                    /\*[^/]/,
                )),
                '*/'
        ))),
    }
});