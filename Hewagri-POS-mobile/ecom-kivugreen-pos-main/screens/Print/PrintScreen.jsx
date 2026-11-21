import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Button,
    FlatList,
    TouchableOpacity,
} from 'react-native';
import PosPrinter from 'react-native-pos-printer';
import RNFetchBlob from 'rn-fetch-blob';
import { createStylesSafe } from '../../assets/styles/Styles';
// const Command = PosPrinter.


export const RNPrintExample = ({ route, navigation }) => {
    const [devices, setDevices] = useState([]);

    const getDevices = () => {
        // console.log('getDevices');

        PosPrinter.getDevices()
            .then((device) => {
                setDevices(device)
            })
            .catch((err) => console.log(err));
    };

    const connectDevice = (device) => {
        console.log('connectDevice', device);

        PosPrinter.connectDevice(`ZCSPrint-66:11:22:33:44:55` || device.identifier)
            .then((res) => console.log(res))
            .catch((err) => console.log(err));
    };

    const printTestReceipt = async () => {
        // console.log('printTestReceipt', PrinterConstants, printerCommand);

        // const cmd = [
        //     printerCommand.setPrinter(PrinterConstants.Command.CODE_PAGE, 26),
        // ];

        // const logo = await RNFetchBlob.config({
        //     path: `${RNFetchBlob.fs.dirs.DownloadDir}/250px-Photopea_logo.svg.png`,
        // }).fetch('GET', receipt.logoURL);
        // cmd.push(printerCommand.printImageFromStorage(logo.path()));

        // cmd.push(
        //     printerCommand.setPrinter(
        //         PrinterConstants.Command.ALIGN,
        //         PrinterConstants.Command.ALIGN_CENTER
        //     ),
        //     printerCommand.setPrinter(PrinterConstants.Command.FONT_MODE, 1),
        //     printerCommand.printLine(`เลขที่ประจําตัวผู้เสียภาษี: ${receipt.TIN}`),
        //     printerCommand.printLine(receipt.addressLine1),
        //     printerCommand.printLine(receipt.addressLine2),
        //     printerCommand.printSeparator30('-------'),
        //     printerCommand.printLine('')
        // );

        // cmd.push(
        //     printerCommand.setPrinter(
        //         PrinterConstants.Command.ALIGN,
        //         PrinterConstants.Command.ALIGN_LEFT
        //     ),
        //     printerCommand.setPrinter(PrinterConstants.Command.FONT_MODE, 0),
        //     printerCommand.printLine(`เลขที่ใบเสร็จรับเงิน: ${receipt.receiptNo}`),
        //     printerCommand.printLine(`ชื่อลูกค้า: ${receipt.customerName}`),
        //     printerCommand.printLine(`เลขที่สัญญา: ${receipt.contractNo}`),
        //     printerCommand.printLine(`วันที่ชำระเงิน: ${receipt.receiptDate}`),
        //     printerCommand.printLine(`เวลา: ${receipt.receiptTime}`),
        //     printerCommand.printLine(`จำนวนเงินที่ชำระ: ${receipt.receiptAmount}`),
        //     printerCommand.printLine(`ชำระโดย: เงินสด`),
        //     printerCommand.printLine(`ผู้รับเงิน: ${receipt.collectorName}`),
        //     printerCommand.setPrinter(PrinterConstants.Command.FONT_MODE, 1),
        //     printerCommand.printLine(''),
        //     printerCommand.setPrinter(
        //         PrinterConstants.Command.ALIGN,
        //         PrinterConstants.Command.ALIGN_CENTER
        //     ),
        //     printerCommand.printSeparator30('-------'),
        //     printerCommand.printLine('')
        // );

        // cmd.push(
        //     printerCommand.setPrinter(
        //         PrinterConstants.Command.ALIGN,
        //         PrinterConstants.Command.ALIGN_CENTER
        //     ),
        //     printerCommand.setPrinter(PrinterConstants.Command.FONT_MODE, 1),
        //     printerCommand.printLine('โปรดตรวจสอบรายการชำระเงินของท่าน'),
        //     printerCommand.printLine(''),
        //     printerCommand.printBarCode(
        //         PrinterConstants.BarcodeType.CODE128,
        //         10,
        //         10,
        //         10,
        //         receipt.barcode()
        //     ),
        //     printerCommand.printLine(''),
        //     printerCommand.printLine('')
        // );

        try {
            PosPrinter.connectDevice(`ZCSPrint-66:11:22:33:44:55`)
                .then((res) => {
                    PosPrinter.printTestReceipt(null, "TEST D'IMPRESSION ICI", null)
                        .then((res) => console.log(res))
                        .catch((err) => console.log(err));
                })
                .catch((err) => console.log(err));
        } catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {

        PosPrinter.init(false)
            .then((res) => {
                // console.log('====================================');
                // console.log(PosPrinter.isDebug(true));
                // console.log('====================================');
                // ()
            })
            .catch((err) => console.log(err));
    });

    return (
        <View style={styles.container}>
            <View style={styles.box}>
                <Text>Devices:</Text>
                <FlatList
                    data={devices}
                    keyExtractor={(device) => device.identifier}
                    renderItem={({ item }) => {
                        return (
                            <TouchableOpacity onPress={() => connectDevice(item)}>
                                <View>
                                    <Text>Identifier: {item.identifier}</Text>
                                    <Text>Name: {item.name}</Text>
                                </View>
                            </TouchableOpacity>
                        );
                    }}
                />
                <Button title="Get Devices" onPress={() => getDevices()} />
            </View>
            <View style={styles.box}>
                <Button title="Print Test Receipt" onPress={() => printTestReceipt()} />
            </View>
        </View>
    );
};

const _rawStyles = {
    container: {
        flex: 1,
    },
    box: {
        margin: 10,
    },
};

const styles = createStylesSafe(_rawStyles, 'PrintScreen');