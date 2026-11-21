import * as React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SigninScreen } from './screens/Signin/Signinscreen';
import { SignupScreen } from './screens/Signup/Signupscreen';
import { SettingScreen } from './screens/Settings/SettingScreen';
import { ProfileScreen } from './screens/Profile/Profilescreen';
import { TabBottom } from './components/Tabbottomnavigation/com.tabbottomnavigation';
import { LoadingSceen } from './screens/Loading/LoadingScreen';
import { Provider } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import { Searchscreen } from './screens/SearchScreen/SearchScreen';
import { NfcreaderScreen } from './screens/Nfcreader/Nfcreader';
import { AboutScreen } from './screens/About/AboutScreen';
import { BarcodereaderScreen } from './screens/Barcodereader/BarcodeReaderScreen';
import { RNPrintExample } from './screens/Print/PrintScreen';
import { routes } from './assets/helper/helper.routes';
import { ApprovisionnemtScreen } from './screens/Approvisionnement/Appro';
import { ApprovisionnemtOutScreen } from './screens/Approvisionnement/Approvout';
import { CreditsScreen } from './screens/Credits/Credits';
import { Memberslist } from './screens/Members/Listmembers';
import { AddmemberScreen } from './screens/Members/Addmember';
import { RNPrintExampleOut } from './screens/Print/Printout';
import { AboutcoopScreen } from './screens/Aboutcoop/AboutcoopScreen';
import { StockScreen } from './screens/Stock/Stocklisteproduits';
import { DetailsApproviionnement } from './screens/Stock/DetailsStockItem';
import { StockFinishedScreen } from './screens/Stock/StocklistStockItemsFinished';
import { CommandeslisteScreen } from './screens/Commandes/Commandesin';
import { DetailscommandeScreen } from './screens/Detailscommande/Detailscommandes';
import { CommandeslistebystateScreen } from './screens/Commandes/Commandebystate';
import { HomeLivreurScreen } from './screens/Home/Homelivreur.screen';
import { ProfileLivreurScreen } from './screens/Profile/Profilelivreuerscreen';
import { LivreurgotScreen } from './screens/Barcodereader/Livreurgotcommande';
import { CommandeslistalleScreen } from './screens/Commandes/Commandesall';
import { HomeScreen } from './screens/Home/Home.screen';
import { StockhistoriquesScreen } from './screens/Stock/Stockhistoriques';
import { DetailsApproviionnementParMembre } from './screens/Stock/DetailsStockByMember';
import { ListeCreditScreen } from './screens/Credits/ListeCreditScreen';
import { DetailsCreditScreen } from './screens/Credits/Detailscredit';
import { ListeCreditsByUserScreen } from './screens/Credits/ListeCreditByUserScreen';
import { ApprovionnementScreen } from './screens/Approvisionnement/Approvisionnnement';
import { StoreStateScreen } from './screens/Stock/Storestate';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <Provider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName='loading'
          screenOptions={{
            headerShown: false
          }}
        >
          <Stack.Screen name="loading" component={LoadingSceen} />
          <Stack.Screen name={"tabs"} component={TabBottom} />
          <Stack.Screen name={routes['about']} component={AboutScreen} />
          <Stack.Screen name={routes['aboutcoop']} component={AboutcoopScreen} />
          <Stack.Screen name={routes['bonentree']} component={ApprovisionnemtScreen} />
          <Stack.Screen name={routes['bonsortie']} component={ApprovisionnemtOutScreen} />
          <Stack.Screen name={routes['credit']} component={CreditsScreen} />
          <Stack.Screen name={routes['members']} component={Memberslist} />
          <Stack.Screen name={routes['addmember']} component={AddmemberScreen} />
          <Stack.Screen name={routes['search']} component={Searchscreen} />
          <Stack.Screen name={routes['auth']} component={SigninScreen} />
          <Stack.Screen name={routes['profile']} component={ProfileScreen} />
          <Stack.Screen name={routes['settings']} component={SettingScreen} />
          <Stack.Screen name={routes['printentry']} component={RNPrintExample} />
          <Stack.Screen name={routes['printremove']} component={RNPrintExampleOut} />
          <Stack.Screen name={routes['storage']} component={StockScreen} />
          <Stack.Screen name={routes['storagefinished']} component={StockFinishedScreen} />
          <Stack.Screen name={routes['storagedetails']} component={DetailsApproviionnement} />
          <Stack.Screen name={routes['commandes']} component={CommandeslisteScreen} />
          <Stack.Screen name={routes['commandesall']} component={CommandeslistalleScreen} />
          <Stack.Screen name={routes['commandesdone']} component={CommandeslistebystateScreen} />
          <Stack.Screen name={routes['detailscommande']} component={DetailscommandeScreen} />
          <Stack.Screen name={routes['qrcodereader']} component={BarcodereaderScreen} />
          <Stack.Screen name={routes['homelivreur']} component={HomeLivreurScreen} />
          <Stack.Screen name={routes['home']} component={HomeScreen} />
          <Stack.Screen name={routes['profilelivreur']} component={ProfileLivreurScreen} />
          <Stack.Screen name={routes['getcommande']} component={LivreurgotScreen} />
          <Stack.Screen name={routes['historiques']} component={StockhistoriquesScreen} />
          <Stack.Screen name={routes['detailshistoriques']} component={DetailsApproviionnementParMembre} />
          <Stack.Screen name={routes['listecredits']} component={ListeCreditScreen} />
          <Stack.Screen name={routes['listcreditsbyuser']} component={ListeCreditsByUserScreen} />
          <Stack.Screen name={routes['detailscredit']} component={DetailsCreditScreen} />
          <Stack.Screen name={routes['storagemaker']} component={ApprovionnementScreen} />
          <Stack.Screen name={routes['storagestate']} component={StoreStateScreen} />
        </Stack.Navigator>
      </NavigationContainer>
      <Toast config={{ position: 'top', visibilityTime: 3000 }} />
    </Provider>
  );
}