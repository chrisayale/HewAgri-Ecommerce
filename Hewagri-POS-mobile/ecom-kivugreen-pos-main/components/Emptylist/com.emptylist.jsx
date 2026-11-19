import * as React from 'react';
import { View, Text } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { Dims } from '../../assets/dimensions/Dimemensions';
import { Colors } from '../../assets/colors/Colors';

export const EmptyList = ({ options }) => {
    return (
        <View style={{ width: "80%", height: "auto", alignSelf: "center", marginVertical: 45 }}>
            <Text style={{ textAlign: "center", fontFamily: "mons", fontSize: Dims.bigtitletextsize, color: options ? options.color : Colors.primaryColor }}>Aucune information</Text>
            <Text style={{ textAlign: "center", fontFamily: "mons-e", fontSize: Dims.subtitletextsize, color: options ? options.color : Colors.primaryColor }}>Aucune information disponible à afficher pour le moment !</Text>
            <View style={{ alignSelf: "center", marginTop: 12 }}>
                <FontAwesome5 name="box-open" size={Dims.bigiconsize} color={options ? options.color : Colors.primaryColor} />
            </View>
        </View>
    )
}