import * as React from 'react'
import { Modal, View } from 'react-native'
import { Title } from '../Title/Title'
import { Colors } from '../../assets/colors/Colors'
import { Dims } from '../../assets/dimensions/Dimemensions'
import { AntDesign } from '@expo/vector-icons'
import { Text } from 'react-native'


export const MessageComponent = ({ navigation, title, subtitle, action, type }) => {
    return (
        <>
            <Modal
                visible={true}
                transparent={false}
            >
                <Title subtitle={subtitle} title={title} navigation={navigation} />
                <View style={{ width: "100%", padding: 20, justifyContent: "center", backgroundColor: Colors.whiteColor, height: Dims.height - 300 }}>
                    {type === 1 && (
                        <View style={{ width: "90%", alignSelf: "center", alignContent: "center", alignItems: "center", padding: 30 }}>
                            <AntDesign name="checkcircle" size={Dims.bigiconsize + 20} color={Colors.successColor} />
                            <Text style={{ fontFamily: "mons", fontSize: 23, marginTop: 10, color: Colors.successColor }}>Opération réussie</Text>
                            <Text style={{ textAlign: "center", fontFamily: "mons-e", fontSize: Dims.subtitletextsize }}>l'opération  de transfert a réussie avec succès</Text>
                        </View>
                    )}
                    {type === 2 && (
                        <View style={{ width: "90%", alignSelf: "center", alignContent: "center", alignItems: "center", padding: 30 }}>
                            <AntDesign name="closecircle" size={Dims.bigiconsize + 20} color={Colors.dangerColor} />
                            <Text style={{ fontFamily: "mons", fontSize: 23, marginTop: 10, color: Colors.dangerColor }}>Opération échouée</Text>
                            <Text style={{ textAlign: "center", fontFamily: "mons-e", fontSize: Dims.subtitletextsize }}>l'opération  de transfert a échoué réessayer un peu plus tard</Text>
                        </View>
                    )}
                </View>
            </Modal>
        </>
    )
}