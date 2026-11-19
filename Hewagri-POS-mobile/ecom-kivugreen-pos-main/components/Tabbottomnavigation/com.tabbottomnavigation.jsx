import * as React from 'react';
import { HomeScreen } from '../../screens/Home/Home.screen';
import { AntDesign, Ionicons, MaterialCommunityIcons, Feather, MaterialIcons } from '@expo/vector-icons';
import { Colors } from '../../assets/colors/Colors';
import { View, Image, TouchableOpacity, Animated } from 'react-native';
import { HomeLivreurScreen } from '../../screens/Home/Homelivreur.screen';
import { Dims } from '../../assets/dimensions/Dimemensions';
import { CurvedBottomBar } from 'react-native-curved-bottom-bar';
import { styles } from '../../assets/styles/Styles';
import { routes } from '../../assets/helper/helper.routes';
import { CommandeslistalleScreen } from '../../screens/Commandes/Commandesall';

export const TabBottom = ({ navigation }) => {
  const { idcooperative, user, token } = global;
  const { typeaccount } = user;
  const [is, setis] = React.useState(false)

  const _renderIcon = (routeName, selectedTab) => {
    let icon = '';
    let size = Dims.iconsize + 3;
    switch (routeName) {
      case 'Commandes':
        icon = 'cart-arrow-down';
        return <MaterialCommunityIcons
          name={icon}
          size={size}
          color={routeName === selectedTab ? Colors.primaryColor : Colors.inactiveColor}
        />
        break;
      case 'Acceuil':
        icon = 'home';
        return <MaterialIcons
          name={icon}
          size={size}
          color={routeName === selectedTab ? Colors.primaryColor : Colors.inactiveColor}
        />
        break;
    }
  };

  const renderTabBar = ({ routeName, selectedTab, navigate }) => {
    return (
      <TouchableOpacity
        onPress={() => navigate(routeName)}
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        {_renderIcon(routeName, selectedTab)}
      </TouchableOpacity>
    );
  };

  React.useEffect(() => {
    console.log('====================================');
    console.log("Type account ==> ", typeaccount);
    console.log('====================================');
  }, [])

  return (
    <CurvedBottomBar.Navigator
      style={[styles.bottomBar, { display: parseInt(typeaccount) === 2 ? "none" : "flex" }]}
      strokeWidth={0.5}
      height={Dims.tabBottomHeight}
      circleWidth={50}
      bgColor={Colors.pillColor}
      screenOptions={{
        headerShown: false
      }}
      initialRouteName="Acceuil"
      borderTopLeftRight
      renderCircle={(d) => (
        <Animated.View style={styles.btnCircle}>
          <TouchableOpacity
            style={{
              flex: 1,
              justifyContent: 'center',
            }}
            onPress={() => {
              navigation.navigate(routes['getcommande'])
            }}>
            <Ionicons name={'scan'} color={Colors.whiteColor} size={25} />
          </TouchableOpacity>
        </Animated.View>
      )}
      tabBar={renderTabBar}
    >

      <CurvedBottomBar.Screen
        name="Acceuil"
        component={() => parseInt(typeaccount) === 2 ? <HomeScreen navigation={navigation} /> : <HomeLivreurScreen navigation={navigation} />}
        position="LEFT"
      />

      <CurvedBottomBar.Screen
        name="Commandes"
        position="RIGHT"
        component={() => <CommandeslistalleScreen navigation={navigation} />}
      />
    </CurvedBottomBar.Navigator>
  );
};