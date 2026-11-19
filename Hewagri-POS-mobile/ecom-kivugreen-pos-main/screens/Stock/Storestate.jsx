import React from "react";
import { StoreAsRegisterComponent } from "../../components/Store/Storeregister";
import { Title } from "../../components/Title/Title";

export const StoreStateScreen = ({ navigation, route }) => {
    const [isloading, setisloading] = React.useState(false)

    return (
        <>
            <Title navigation={navigation} title={"Etat de stock"} subtitle={"Eta de stock des produits"} />
            <StoreAsRegisterComponent isloading={isloading} zork={true} />
        </>
    )
}