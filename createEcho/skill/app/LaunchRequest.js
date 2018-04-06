'use strict';

/**
 * ダイアログでSkillを起動した際に呼び出される
 */
function execute() {
    this.attributes.errorCount = 0;
    this.emit(':ask', 'Welcome. I am maaya. Please order me.');
}
module.exports.execute = execute;