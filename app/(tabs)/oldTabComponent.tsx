{/* <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#007bff',
          tabBarInactiveTintColor: '#6c757d',
          tabBarPosition: 'bottom',
          animation: 'fade',
          tabBarStyle: {
            borderTopWidth: StyleSheet.hairlineWidth,
            borderTopColor: '#FFFFFF',
            height: defaultTabBarHeight + insets.bottom,
          },
          tabBarItemStyle: {
            paddingVertical: 10,
            paddingBottom: 20
          }
        }}
      >
        <Tabs.Screen 
          name="index" 
          options={{ 
            title: 'home',
            tabBarLabel: 'home',
            tabBarIcon: ({color, size}) => <Feather name="home" color={color} size={size}/>
          }}
        />
        <Tabs.Screen
          name="tools"
          options={{
            title: 'tools',
            tabBarLabel: 'tools',
            tabBarIcon: ({color, size}) => <Entypo name="tools" color={color} size={size}/>
          }}
        />
        <Tabs.Screen
          name="calendar"
          options={{
            title: 'calendar',
            tabBarLabel:'calendar',
            tabBarIcon: ({color, size}) => <Entypo name="calendar" color={color} size={size}/>
          }}
        />
        <Tabs.Screen
          name="classroom"
          options={{
            title: 'classroom',
            tabBarLabel: 'classroom',
            tabBarIcon: ({color, size}) => <MaterialCommunityIcons name="google-classroom" color={color} size={size}/>
          }}
          listeners={{
            tabPress: (e) => {
              e.preventDefault();
              classroomPress();
            }
          }}
        />
      </Tabs>
      <Footer /> */}