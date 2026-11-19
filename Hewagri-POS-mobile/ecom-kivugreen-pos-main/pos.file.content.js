"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function () { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function () { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_native_1 = require("react-native");
var isAndroid = react_native_1.Platform.OS === 'android';
var rn_fetch_blob_1 = __importDefault(require("rn-fetch-blob"));
var printerCommand_1 = require("./printerCommand");
var PrinterModule = /** @class */ (function () {
    function PrinterModule() {
        this.isDebug = false;
        this.printerModule = react_native_1.NativeModules.RNPosPrinter;
        this.log('Printer module is null ' + !!this.printerModule);
    }
    // initiate pos printer
    PrinterModule.prototype.init = function (isDebug) {
        if (isDebug === void 0) { isDebug = false; }
        this.isDebug = isDebug;
        if (!isAndroid)
            return Promise.reject('IOS is not supported');
        return this.printerModule.init();
    };
    // get all pos printer devices
    PrinterModule.prototype.getDevices = function () {
        if (!isAndroid)
            return Promise.reject('IOS is not supported');
        return this.printerModule.getDevices();
    };
    // scan all pos printer devices
    PrinterModule.prototype.scanDevices = function (callback) {
        if (!isAndroid)
            return Promise.reject('IOS is not supported');
        this.log('start scanning devices');
        this.callback = callback;
        this.printerModule.scanDevices();
        this.listenToNativeEvent(true);
        return Promise.resolve(true);
    };
    // stop scannning
    PrinterModule.prototype.stopScanDevices = function () {
        if (!isAndroid)
            return Promise.reject('IOS is not supported');
        this.callback = null;
        this.printerModule.stopScanningDevices();
        if (this.deviceEventEmitter)
            this.deviceEventEmitter.remove();
        this.log('stop scanning devices');
        return Promise.resolve(true);
    };
    // connect to pos printer device
    PrinterModule.prototype.connectDevice = function (deviceID, timeout) {
        if (timeout === void 0) { timeout = 30000; }
        if (!isAndroid)
            return Promise.reject('IOS is not supported');
        if (this.deviceEventEmitter)
            this.deviceEventEmitter.remove();
        return this.printerModule.connectDevice(deviceID, timeout);
    };
    // connect and print to pos printer device
    PrinterModule.prototype.connectAndPrintReceipt = function (deviceId) {
        var _this = this;
        return this.connectDevice(deviceId, 3000)
            .then(function () {
                return _this.initiatePrintReceipt();
            });
    };
    // listen all changed state from native events
    PrinterModule.prototype.listenToNativeEvent = function (start) {
        var _this = this;
        if (start) {
            this.deviceEventEmitter = react_native_1.DeviceEventEmitter
                .addListener('available_bluetooth_devices', function (devices) {
                    _this.log('available devices' + JSON.stringify(devices));
                    if (_this.callback)
                        _this.callback(devices);
                });
            return;
        }
        if (this.deviceEventEmitter)
            this.deviceEventEmitter.remove();
    };
    // log message error
    PrinterModule.prototype.log = function (message) {
        if (this.isDebug) {
            // tslint:disable-next-line:no-console
            console.log('POS Printer', message);
        }
    };
    // initiate printer with image before print
    PrinterModule.prototype.initiatePrintReceipt = function () {
        var _this = this;
        try {
            var dirs = rn_fetch_blob_1.default.fs.dirs;
            return rn_fetch_blob_1.default
                .config({
                    // response data will be saved to this path if it has access right.
                    path: dirs.SDCardDir + '/image.png',
                })
                .fetch('GET', 'download url')
                .then(function (res) {
                    _this.log('print with image, download image success');
                    return _this.printTestReceipt(res.path());
                })
                .catch(function (e) {
                    // fallback if something went wrong with rn fetch blob
                    _this.log('print with image, fallback print without image' + JSON.stringify(e));
                    return _this.printTestReceipt();
                });
        }
        catch (e) {
            // fallback if something went wrong with rn fetch blob
        }
    };
    // printer all commands to printer
    PrinterModule.prototype.printTestReceipt = function (storageUrl) {
        const formatDate = ({ dateStr }) => {
            const date = new Date(dateStr);
            // Extraction des composants de la date
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0'); // Les mois sont de 0 à 11
            const year = date.getFullYear();
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            const seconds = String(date.getSeconds()).padStart(2, '0');

            // Construction de la date et de l'heure formatées
            return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
        }
        return __awaiter(this, void 0, void 0, function () {
            var cmd, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        try {
                            cmd = [
                                printerCommand_1.printerCommand.setPrinter(printerCommand_1.PrinterConstants.Command.ALIGN, printerCommand_1.PrinterConstants.Command.ALIGN_CENTER),
                                printerCommand_1.printerCommand.setFont(-100, 0, -5, 0),
                            ];
                            const item = JSON.parse(storageUrl);
                            if (item.hasOwnProperty("out-delivery")) {
                                const { coopec, group, item: asitem, transaction } = item;
                                const { email, id, nom, postnom, sexe, phone } = asitem
                                const somme = [0, 0];
                                cmd.push(printerCommand_1.printerCommand.printLine('HewAgri'));
                                cmd.push(printerCommand_1.printerCommand.printLine("L'agriculture digitale en RDC c'est nous."));
                                cmd.push(printerCommand_1.printerCommand.printSeparator30('-----'));
                                cmd.push(printerCommand_1.printerCommand.printKeyValue30(printerCommand_1.Printertools.generateKeyValuePair('', 'ID Trans.', 0), ` ${transaction}`));
                                // cmd.push(printerCommand_1.printerCommand.printKeyValue30(printerCommand_1.Printertools.generateKeyValuePair('', 'Coopérative', 0), ` ${cooperative}`));
                                // cmd.push(printerCommand_1.printerCommand.printKeyValue30(printerCommand_1.Printertools.generateKeyValuePair('', 'Num. erg. coopéc.', 0), ` ${num_enregistrement}`));
                                cmd.push(printerCommand_1.printerCommand.printKeyValue30(printerCommand_1.Printertools.generateKeyValuePair('', 'Client', 0), ` ${nom} ${postnom}`));
                                cmd.push(printerCommand_1.printerCommand.printKeyValue30(printerCommand_1.Printertools.generateKeyValuePair('', 'Contact client', 0), ` ${phone}`));
                                cmd.push(printerCommand_1.printerCommand.printKeyValue30(printerCommand_1.Printertools.generateKeyValuePair('', 'Date', 0), `${new Date().toDateString()}`));

                                cmd.push(printerCommand_1.printerCommand.printSeparator30('-----'));
                                cmd.push(printerCommand_1.printerCommand.printKeyValue30(printerCommand_1.Printertools.generateKeyValuePair('', '|Produit', 0), ` | Qté. |`));
                                cmd.push(printerCommand_1.printerCommand.printSeparator30('-----'));
                                Array.from(group).map(prd => {
                                    const { prix_total, prix_unit, __tbl_ecom_produit, __tbl_ecom_unitesmesure, qte, currency } = prd;
                                    const { produit } = __tbl_ecom_produit
                                    const { unity } = __tbl_ecom_unitesmesure
                                    cmd.push(printerCommand_1.printerCommand.printKeyValue30(printerCommand_1.Printertools.generateKeyValuePair('', '|' + produit, 0), ` | ${qte}${unity} |`));
                                    cmd.push(printerCommand_1.printerCommand.printSeparator30('-----'));
                                    somme.push(prix_total);
                                })
                                // cmd.push(printerCommand_1.printerCommand.printSeparator30('-----'));
                                cmd.push(printerCommand_1.printerCommand.printKeyValue30(printerCommand_1.Printertools.generateKeyValuePair('', '|Montant payable', 0), ` | ${somme.reduce((_, __) => _ + __)} CDF|`));
                                cmd.push(printerCommand_1.printerCommand.printSeparator30('-----'));

                                cmd.push(printerCommand_1.printerCommand.printLine(`Confirmation de livraison pour ${nom} ${postnom}, en date du ${new Date().toDateString()}`));
                                cmd.push(printerCommand_1.printerCommand.printLine(''));
                                cmd.push(printerCommand_1.printerCommand.printText('--- fin ---'));
                                cmd.push(printerCommand_1.printerCommand.printLine(''));
                                cmd.push(printerCommand_1.printerCommand.printLine(''));
                                cmd.push(printerCommand_1.printerCommand.printLine(''));
                                cmd.push(printerCommand_1.printerCommand.printLine(''));
                                _a.label = 1;
                            } else {
                                if (item.hasOwnProperty("out")) {
                                    const { coopec, group, item: asitem, transaction } = item;
                                    const { cooperative, num_enregistrement } = coopec;
                                    const { email, id, nom, postnom, sexe, phone } = asitem;
                                    const somme = [0, 0];
                                    cmd.push(printerCommand_1.printerCommand.printLine('HewAgri'));
                                    cmd.push(printerCommand_1.printerCommand.printLine("L'agriculture digitale en RDC c'est nous."));
                                    cmd.push(printerCommand_1.printerCommand.printSeparator30('-----'));
                                    cmd.push(printerCommand_1.printerCommand.printKeyValue30(printerCommand_1.Printertools.generateKeyValuePair('', 'ID Trans.', 0), ` ${transaction}`));
                                    cmd.push(printerCommand_1.printerCommand.printKeyValue30(printerCommand_1.Printertools.generateKeyValuePair('', 'Coopérative', 0), ` ${cooperative}`));
                                    cmd.push(printerCommand_1.printerCommand.printKeyValue30(printerCommand_1.Printertools.generateKeyValuePair('', 'Num. erg. coopéc.', 0), ` ${num_enregistrement}`));
                                    cmd.push(printerCommand_1.printerCommand.printKeyValue30(printerCommand_1.Printertools.generateKeyValuePair('', 'Client', 0), ` ${nom} ${postnom}`));
                                    cmd.push(printerCommand_1.printerCommand.printKeyValue30(printerCommand_1.Printertools.generateKeyValuePair('', 'Contact client', 0), ` ${phone}`));
                                    cmd.push(printerCommand_1.printerCommand.printKeyValue30(printerCommand_1.Printertools.generateKeyValuePair('', 'Date', 0), `${new Date().toDateString()}`));

                                    cmd.push(printerCommand_1.printerCommand.printSeparator30('-----'));
                                    cmd.push(printerCommand_1.printerCommand.printKeyValue30(printerCommand_1.Printertools.generateKeyValuePair('', '|Produit', 0), ` | Qté. |`));
                                    cmd.push(printerCommand_1.printerCommand.printSeparator30('-----'));
                                    Array.from(group).map(prd => {
                                        const { prix_total, prix_unit, __tbl_ecom_produit, __tbl_ecom_unitesmesure, qte, currency } = prd;
                                        const { produit } = __tbl_ecom_produit
                                        const { unity } = __tbl_ecom_unitesmesure
                                        cmd.push(printerCommand_1.printerCommand.printKeyValue30(printerCommand_1.Printertools.generateKeyValuePair('', '|' + produit, 0), ` | ${qte}${unity} |`));
                                        cmd.push(printerCommand_1.printerCommand.printSeparator30('-----'));
                                        somme.push(prix_total);
                                    })
                                    // cmd.push(printerCommand_1.printerCommand.printSeparator30('-----'));
                                    cmd.push(printerCommand_1.printerCommand.printKeyValue30(printerCommand_1.Printertools.generateKeyValuePair('', '|Montant payable', 0), ` | ${somme.reduce((_, __) => _ + __)} CDF|`));
                                    cmd.push(printerCommand_1.printerCommand.printSeparator30('-----'));

                                    cmd.push(printerCommand_1.printerCommand.printLine(`Récu de livraison au client ${nom} ${postnom}, joingnable au ${phone}`));
                                    cmd.push(printerCommand_1.printerCommand.printLine(''));
                                    cmd.push(printerCommand_1.printerCommand.printText('--- fin ---'));
                                    cmd.push(printerCommand_1.printerCommand.printLine(''));
                                    cmd.push(printerCommand_1.printerCommand.printLine(''));
                                    cmd.push(printerCommand_1.printerCommand.printLine(''));
                                    _a.label = 1;
                                }
                                if (item.hasOwnProperty('out-singgle-product')) {
                                    const { transaction, __tbl_ecom_produit, __tbl_ecom_unitesmesure, membre, __tbl_ecom_category, __tbl_ecom_user, createdAt, __tbl_ecom_cooperative, __tbl_ecom_produits, date_production, qte: as_single_qte, updatedAt } = item
                                    const { produit: as_signle_product } = __tbl_ecom_produit;
                                    const { nom, postnom, prenom, phone, email } = __tbl_ecom_user
                                    const { category } = __tbl_ecom_category
                                    const { unity: as_single_unity } = __tbl_ecom_unitesmesure
                                    const { adresse, phone: as_phone_cooperative, num_enregistrement, cooperative } = __tbl_ecom_cooperative

                                    // cmd.push(printerCommand_1.printerCommand.printImageFromStorage('assets/images/hewagri-logo.png'));
                                    cmd.push(printerCommand_1.printerCommand.printLine('HewAgri'));
                                    cmd.push(printerCommand_1.printerCommand.printLine("L'agriculture digitale en RDC c'est nous."));
                                    cmd.push(printerCommand_1.printerCommand.printSeparator30('-----'));
                                    cmd.push(printerCommand_1.printerCommand.printKeyValue30(printerCommand_1.Printertools.generateKeyValuePair('', 'Coopérative : ', 0), ` ${cooperative}`));
                                    cmd.push(printerCommand_1.printerCommand.printKeyValue30(printerCommand_1.Printertools.generateKeyValuePair('', 'Num. erg. coopéc. : ', 0), ` ${num_enregistrement}`));
                                    cmd.push(printerCommand_1.printerCommand.printKeyValue30(printerCommand_1.Printertools.generateKeyValuePair('', 'Contact Coopéc. : ', 0), ` ${as_phone_cooperative}`));
                                    cmd.push(printerCommand_1.printerCommand.printKeyValue30(printerCommand_1.Printertools.generateKeyValuePair('', 'Date : ', 0), `${formatDate({ dateStr: createdAt })}`));

                                    cmd.push(printerCommand_1.printerCommand.printSeparator30('-----'));
                                    cmd.push(printerCommand_1.printerCommand.printKeyValue30(printerCommand_1.Printertools.generateKeyValuePair('', '|Produit', 0), ` | Qté. |`));
                                    cmd.push(printerCommand_1.printerCommand.printSeparator30('-----'));
                                    // ----------- product informatios goes here ------------
                                    cmd.push(printerCommand_1.printerCommand.printKeyValue30(printerCommand_1.Printertools.generateKeyValuePair('', '|' + as_signle_product, 0), ` | ${as_single_qte}${as_single_unity} |`));
                                    cmd.push(printerCommand_1.printerCommand.printSeparator30('-----'));
                                    // ------------------------------------------------------
                                    cmd.push(printerCommand_1.printerCommand.printKeyValue30(printerCommand_1.Printertools.generateKeyValuePair('', 'Membre : ', 0), ` ${membre}`));
                                    cmd.push(printerCommand_1.printerCommand.printKeyValue30(printerCommand_1.Printertools.generateKeyValuePair('', 'Téléphone : ', 0), ` ${phone}`));
                                    // cmd.push(printerCommand_1.printerCommand.printKeyValue30(printerCommand_1.Printertools.generateKeyValuePair('', 'Contact Coopéc.', 0), ` ${as_phone_cooperative}`));
                                    // ------------------------------------------------------
                                    cmd.push(printerCommand_1.printerCommand.printLine(''));
                                    cmd.push(printerCommand_1.printerCommand.printLine(''));
                                    cmd.push(printerCommand_1.printerCommand.printText('--- fin ---'));
                                    cmd.push(printerCommand_1.printerCommand.printLine(''));
                                    cmd.push(printerCommand_1.printerCommand.printLine(''));
                                    cmd.push(printerCommand_1.printerCommand.printLine(''));
                                    cmd.push(printerCommand_1.printerCommand.printLine(''));
                                    cmd.push(printerCommand_1.printerCommand.printLine(''));
                                    _a.label = 1;
                                }
                                if (item.hasOwnProperty('derictly-printed')) {

                                    const { produits: __tbl_ecom_produits, transaction, createdAt, __tbl_ecom_cooperative, valorisation, membre } = item
                                    const { sigle, cooperative, num_enregistrement, phone } = __tbl_ecom_cooperative
                                    const { nom: full_name, phone: contact_member, __tbl_ecom_hasmember } = membre
                                    const { id: card } = __tbl_ecom_hasmember
                                    // cmd.push(printerCommand_1.printerCommand.printImageFromStorage('assets/images/hewagri-logo.png'));
                                    cmd.push(printerCommand_1.printerCommand.printLine('HewAgri'));
                                    cmd.push(printerCommand_1.printerCommand.printLine("L'agriculture digitale en RDC c'est nous."));
                                    cmd.push(printerCommand_1.printerCommand.printSeparator30('-----'));
                                    cmd.push(printerCommand_1.printerCommand.printKeyValue30(printerCommand_1.Printertools.generateKeyValuePair('', 'Référence', 0), ` ${transaction}`));
                                    cmd.push(printerCommand_1.printerCommand.printKeyValue30(printerCommand_1.Printertools.generateKeyValuePair('', 'Coopérative', 0), ` ${cooperative}`));
                                    cmd.push(printerCommand_1.printerCommand.printKeyValue30(printerCommand_1.Printertools.generateKeyValuePair('', 'Num. erg. coopéc.', 0), ` ${num_enregistrement}`));
                                    cmd.push(printerCommand_1.printerCommand.printKeyValue30(printerCommand_1.Printertools.generateKeyValuePair('', 'Contact Coopéc.', 0), ` ${phone}`));
                                    cmd.push(printerCommand_1.printerCommand.printKeyValue30(printerCommand_1.Printertools.generateKeyValuePair('', 'Date', 0), `${new Date().toDateString()}`));

                                    cmd.push(printerCommand_1.printerCommand.printSeparator30('-----'));
                                    cmd.push(printerCommand_1.printerCommand.printKeyValue30(printerCommand_1.Printertools.generateKeyValuePair('', '|Produit', 0), ` | Qté. |`));
                                    cmd.push(printerCommand_1.printerCommand.printSeparator30('-----'));
                                    Array.from(__tbl_ecom_produits).map(prd => {

                                        const { produit, qte, currency, unity = 'kg' } = prd;
                                        cmd.push(printerCommand_1.printerCommand.printKeyValue30(printerCommand_1.Printertools.generateKeyValuePair('', '|' + produit, 0), ` | ${qte}${unity} |`));
                                        cmd.push(printerCommand_1.printerCommand.printSeparator30('-----'));
                                    })
                                    cmd.push(printerCommand_1.printerCommand.printLine(''));
                                    cmd.push(printerCommand_1.printerCommand.printLine(''));
                                    cmd.push(printerCommand_1.printerCommand.printLine("Valorisation :             "));
                                    Array.from(Object.keys(valorisation)).map(val => {
                                        cmd.push(printerCommand_1.printerCommand.printKeyValue30(printerCommand_1.Printertools.generateKeyValuePair('', val, 0), ` ${valorisation[val]}`));
                                    })
                                    cmd.push(printerCommand_1.printerCommand.printSeparator30('-----'));
                                    cmd.push(printerCommand_1.printerCommand.printKeyValue30(printerCommand_1.Printertools.generateKeyValuePair('', 'Nom Memb.', 0), ` ${full_name}`));
                                    cmd.push(printerCommand_1.printerCommand.printKeyValue30(printerCommand_1.Printertools.generateKeyValuePair('', 'Contact Memb.', 0), ` ${contact_member}`));
                                    cmd.push(printerCommand_1.printerCommand.printKeyValue30(printerCommand_1.Printertools.generateKeyValuePair('', 'Num. Carte', 0), ` ${card}`));
                                    cmd.push(printerCommand_1.printerCommand.printLine(''));
                                    cmd.push(printerCommand_1.printerCommand.printLine(''));
                                    cmd.push(printerCommand_1.printerCommand.printText('--- fin ---'));
                                    cmd.push(printerCommand_1.printerCommand.printLine(''));
                                    cmd.push(printerCommand_1.printerCommand.printLine(''));
                                    cmd.push(printerCommand_1.printerCommand.printLine(''));
                                    cmd.push(printerCommand_1.printerCommand.printLine(''));
                                    _a.label = 1;
                                } else {
                                    const { __tbl_ecom_produits, transaction, createdAt, __tbl_ecom_cooperative, } = item
                                    const { sigle, cooperative, num_enregistrement, phone } = __tbl_ecom_cooperative

                                    // cmd.push(printerCommand_1.printerCommand.printImageFromStorage('assets/images/hewagri-logo.png'));
                                    cmd.push(printerCommand_1.printerCommand.printLine('HewAgri'));
                                    cmd.push(printerCommand_1.printerCommand.printLine("L'agriculture digitale en RDC c'est nous."));
                                    cmd.push(printerCommand_1.printerCommand.printSeparator30('-----'));
                                    cmd.push(printerCommand_1.printerCommand.printKeyValue30(printerCommand_1.Printertools.generateKeyValuePair('', 'Référence', 0), ` ${transaction}`));
                                    cmd.push(printerCommand_1.printerCommand.printKeyValue30(printerCommand_1.Printertools.generateKeyValuePair('', 'Coopérative', 0), ` ${cooperative}`));
                                    cmd.push(printerCommand_1.printerCommand.printKeyValue30(printerCommand_1.Printertools.generateKeyValuePair('', 'Num. erg. coopéc.', 0), ` ${num_enregistrement}`));
                                    cmd.push(printerCommand_1.printerCommand.printKeyValue30(printerCommand_1.Printertools.generateKeyValuePair('', 'Contact Coopéc.', 0), ` ${phone}`));
                                    cmd.push(printerCommand_1.printerCommand.printKeyValue30(printerCommand_1.Printertools.generateKeyValuePair('', 'Date', 0), `${new Date().toDateString()}`));

                                    cmd.push(printerCommand_1.printerCommand.printSeparator30('-----'));
                                    cmd.push(printerCommand_1.printerCommand.printKeyValue30(printerCommand_1.Printertools.generateKeyValuePair('', '|Produit', 0), ` | Qté. |`));
                                    cmd.push(printerCommand_1.printerCommand.printSeparator30('-----'));
                                    Array.from(__tbl_ecom_produits).map(prd => {

                                        const { produit, __tbl_ecom_hasproducts, __tbl_ecom_unitesmesures } = prd;
                                        const { qte, prix_unitaire, currency } = __tbl_ecom_hasproducts
                                        const { unity } = __tbl_ecom_unitesmesures
                                        cmd.push(printerCommand_1.printerCommand.printKeyValue30(printerCommand_1.Printertools.generateKeyValuePair('', '|' + produit, 0), ` | ${qte}${unity} |`));
                                        cmd.push(printerCommand_1.printerCommand.printSeparator30('-----'));
                                    })
                                    cmd.push(printerCommand_1.printerCommand.printLine(''));
                                    cmd.push(printerCommand_1.printerCommand.printLine(''));
                                    cmd.push(printerCommand_1.printerCommand.printText('--- fin ---'));
                                    cmd.push(printerCommand_1.printerCommand.printLine(''));
                                    cmd.push(printerCommand_1.printerCommand.printLine(''));
                                    cmd.push(printerCommand_1.printerCommand.printLine(''));
                                    cmd.push(printerCommand_1.printerCommand.printLine(''));
                                    _a.label = 1;
                                }
                            }
                        } catch (error) {
                            console.log('====================================');
                            console.log("Error on printing bill ==> ", error);
                            console.log('====================================');
                        }
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.printerModule.addCommands(cmd)];
                    case 2:
                        _a.sent();
                        if (this.deviceEventEmitter)
                            this.deviceEventEmitter.remove();
                        return [2 /*return*/];
                    case 3:
                        e_1 = _a.sent();
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return PrinterModule;
}());
var printer = new PrinterModule();
exports.default = printer;
//# sourceMappingURL=index.js.map