import * as React from 'react';
import { View, Text } from 'react-native';
import { Colors } from '../../assets/colors/Colors';
import { appname } from '../../assets/configs/configs';
import { Dims } from '../../assets/dimensions/Dimemensions';
import { Footer } from '../../components/Footer/comp.footer';
import { Title } from '../../components/Title/Title';

export const AboutScreen = ({ navigation }) => {
    return (
        <View style={{ backgroundColor: Colors.whiteColor, flex: 1 }}>
            <Title
                title={`A propos de ${appname}`}
                subtitle={`Ce qu'il faut savoir sur ${appname}`}
                navigation={navigation}
            />
            <View style={{ padding: 20, alignSelf: "center" }}>
                <Text style={{ fontFamily: "mons-b", fontSize: Dims.bigtitletextsize, textAlign: "center" }}>A propos de {appname}</Text>
                <Text style={{ textAlign: "center", fontFamily: "mons-e" }} >
                    🌱 Bienvenue sur {appname} ! 🌾

                    Facilitez vos échanges agricoles avec {appname}, votre plateforme de mise en relation entre acheteurs et vendeurs de produits agricoles. Que vous soyez agriculteur, acheteur en gros ou simplement passionné par l'agriculture, notre application est conçue pour répondre à vos besoins.

                    ✅ Acheteurs et Vendeurs Réunis : Trouvez tout ce dont vous avez besoin en un seul endroit. Les agriculteurs peuvent présenter leurs récoltes et leurs produits, tandis que les acheteurs peuvent parcourir une large gamme de produits agricoles, du frais aux produits transformés.

                    📦 Produits Frais, Locaux et de Qualité : Nous mettons l'accent sur la qualité et la fraîcheur des produits. Nos vendeurs sont soigneusement sélectionnés pour vous offrir des produits agricoles de première qualité, souvent locaux et cultivés de manière responsable.

                    🔍 Recherche Avancée et Filtres Personnalisés : Trouvez rapidement les produits que vous cherchez grâce à notre fonction de recherche avancée et à nos filtres personnalisés. Que vous ayez besoin de fruits, de légumes, de céréales ou d'autres produits, nous avons ce qu'il vous faut.

                    💬 Communication Simplifiée : Notre système de messagerie intégré facilite la communication entre acheteurs et vendeurs. Discutez des détails de la transaction, de la livraison et plus encore en toute simplicité.

                    🌍 Encourager le Commerce Local et Durable : En soutenant les agriculteurs locaux, vous contribuez à promouvoir une économie agricole durable et à réduire votre empreinte carbone en privilégiant les produits locaux.

                    🚀 Inscrivez-vous dès aujourd'hui ! : Que vous soyez un petit producteur, un grossiste ou un acheteur à la recherche de produits frais, [Nom de l'Application] est là pour vous aider à simplifier vos échanges agricoles. Inscrivez-vous dès aujourd'hui et rejoignez notre communauté florissante d'agriculteurs et d'amoureux de l'agriculture !
                </Text>
            </View>
            <Footer />
        </View>
    )
}