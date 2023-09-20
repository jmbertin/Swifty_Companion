/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable no-catch-shadow */
/* eslint-disable no-shadow */
import React, {useEffect, useState, useCallback, useContext} from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Button,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import api42 from '../api42/api';
import HeaderRight from './StudentSearchComponent';
import Toast from 'react-native-toast-message';
import * as Progress from 'react-native-progress';
import {NetworkContext} from '../provider/Provider';

function StudentDetailScreen({ route }) {
  const { isConnected } = useContext(NetworkContext);
  const networkContext = useContext(NetworkContext);
  const {token} = route.params;
  const [studentData, setStudentData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAchievementsExpanded, setIsAchievementsExpanded] = useState(false);
  const [isProjectsExpanded, setIsProjectsExpanded] = useState(false);
  const [isCursusExpanded, setIsCursusExpanded] = useState({});

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const navigation = useNavigation();

  const handleGoToLogin = () => {
    navigation.navigate('LoginScreen');
  };

  const fetchStudentData = useCallback(async () => {
    if (!networkContext.isConnected) {
      Toast.show({
        type: 'error',
        text1: 'No Network',
        text2: 'You are not connected to the network!',
      });
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const studentData = await api42.getUserProfile(token);
      setStudentData(studentData);
    } catch (error) {
      console.log('Error fetching profile datas', error);
      setError(error.message);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Student not found !',
      });
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  const fetchStudentByLogin = useCallback(async () => {
    if (!networkContext.isConnected) {
      Toast.show({
        type: 'error',
        text1: 'No Network',
        text2: 'You are not connected to the network!',
      });
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const studentData = await api42.getUserbyLogin(token, searchQuery);
      setStudentData(studentData);
    } catch (error) {
      console.log('Erreur lors de la récupération du profil', error);
      if (error.message.includes('404')) {
        console.log('Student not found !');
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: `Student ${searchQuery} not found !`,
        });
      } else {
        setError(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  }, [token, searchQuery]);

  function getAchievementIcon(kind) {
    switch (kind) {
      case 'pedagogy':
        return require('../images/achiev_pedagogy.png');
      case 'project':
        return require('../images/achiev_project.png');
      case 'scolarity':
        return require('../images/achiev_scolarity.png');
      case 'social':
        return require('../images/achiev_social.png');
      default:
        return require('../images/achiev_pedagogy.png');
    }
  }

  useEffect(() => {
    if (!networkContext.isConnected) {
      Toast.show({
        type: 'error',
        text1: 'No Network',
        text2: 'You are not connected to the network!',
      });
      return;
    }
    if (token) {
      fetchStudentData();
    }
  }, [token, fetchStudentData]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <HeaderRight
          toggleSearch={() => setIsSearchVisible(prev => !prev)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          fetchStudentByLogin={fetchStudentByLogin}
        />
      ),
    });
  }, [navigation, isSearchVisible, searchQuery, fetchStudentByLogin]);

  if (isLoading) {
    return (
      <ImageBackground
        source={require('../images/back.png')}
        style={styles.backgroundImage}>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      </ImageBackground>
    );
  }

  if (error) {
    if (error === 'Request failed with status code 404') {
      return (
        <ImageBackground
          source={require('../images/back.png')}
          style={styles.backgroundImage}>
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Error: Student not found!</Text>
            <Button title="Go to Login" onPress={handleGoToLogin} />
          </View>
        </ImageBackground>
      );
    }
    return (
      <ImageBackground
        source={require('../images/back.png')}
        style={styles.backgroundImage}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Network Error ! Please reconnect to internet.</Text>
          <Button title="BACK TO HOMEPAGE" onPress={handleGoToLogin} />
        </View>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground
      source={require('../images/back.png')}
      style={styles.backgroundImage}>
      <ScrollView contentContainerStyle={{ padding: 5 }}>
        <View style={{flex: 1, padding: 5}}>
          <Text style={styles.loginContainer}>
            {studentData?.login.toUpperCase()}
          </Text>
          <View style={styles.avatarContainer}>
            <Image
              source={{uri: studentData?.image.versions.medium}}
              style={styles.avatarStyle}
            />
            <View>
              <Text style={styles.textDescription}>
                Full Name: {studentData?.usual_full_name}
              </Text>
              <Text style={styles.textDescription}>
                Email: {studentData?.email}
              </Text>
              <Text style={styles.textDescription}>
                Correction Points: {studentData?.correction_point}
              </Text>
              <Text style={styles.textDescription}>
                Wallet: {studentData?.wallet}
              </Text>
              <Text style={styles.textDescription}>
                Pool : {studentData?.pool_month} {studentData?.pool_year}
              </Text>
            </View>
          </View>

          {studentData?.cursus_users?.map((cursus, index) => {
            if (cursus.cursus.name === '42 events') {
              return null;
            }
            const maxLevel = cursus.cursus.name === 'C Piscine' ? 12 : 21;

            const toggleCursusDetails = () => {
              setIsCursusExpanded(prev => ({
                ...prev,
                [index]: !prev[index],
              }));
            };

            return (
              <View key={index}>
                <TouchableOpacity
                  onPress={toggleCursusDetails}
                  style={styles.sectionHeader}>
                  <Text style={{fontWeight: 'bold', color: '#fff'}}>
                    {cursus.cursus.name}
                  </Text>
                </TouchableOpacity>

                {isCursusExpanded[index] && (
                  <>
                    <View style={styles.progressBarContainer}>
                      <Progress.Bar
                        progress={cursus.level / maxLevel}
                        width={null}
                        height={20}
                        borderRadius={5}
                        borderWidth={1}
                        borderColor="#fff"
                        color="rgba(15, 170, 24, 0.8)"
                      />
                      <View style={styles.progressLabelContainerCursus}>
                        <Text style={styles.progressLabelText}>
                          Cursus Level
                        </Text>
                      </View>
                      <View style={styles.progressLabelContainer}>
                        <Text style={styles.progressLabelText}>
                          {cursus.level.toFixed(2)}
                        </Text>
                      </View>
                    </View>

                    {cursus.skills.map((skill, skillIndex) => (
                      <View key={skillIndex}>
                        <View style={styles.progressBarSkillContainer}>
                          <Progress.Bar
                            progress={skill.level / 20}
                            width={null}
                            height={20}
                            borderRadius={5}
                            borderWidth={1}
                            borderColor="#fff"
                            color="rgba(15, 170, 24, 0.5)"
                          />
                          <View style={styles.progressLabelSkillContainerCursus}>
                            <Text style={styles.progressLabelSkillText}>
                              {skill.name}
                            </Text>
                          </View>
                          <View style={styles.progressLabelSkillContainer}>
                            <Text style={styles.progressLabelSkillText}>
                              {skill.level.toFixed(2)} ({(skill.level * 5).toFixed(0)}%)
                            </Text>
                          </View>
                        </View>
                      </View>
                    ))}
                  </>
                )}
              </View>
            );
          })}

          <TouchableOpacity
            onPress={() => setIsAchievementsExpanded(!isAchievementsExpanded)}
            style={styles.sectionHeader}>
            <Text style={{fontWeight: 'bold', color: '#fff'}}>
              Achievements
            </Text>
          </TouchableOpacity>
          {isAchievementsExpanded &&
            studentData?.achievements?.map((achievement, index) => (
              <View style={styles.achievementContainer} key={index}>
                <Image
                  source={getAchievementIcon(achievement.kind)}
                  style={styles.achievementIcon}
                />
                <Text style={styles.achievementText}>
                  {achievement.description}
                </Text>
              </View>
            ))}

          <TouchableOpacity
            onPress={() => setIsProjectsExpanded(!isProjectsExpanded)}
            style={styles.sectionHeader}>
            <Text style={{fontWeight: 'bold', color: '#fff'}}>Projects</Text>
          </TouchableOpacity>
          {isProjectsExpanded &&
            studentData?.projects_users
              ?.sort((a, b) => a.project.name.localeCompare(b.project.name))
              .map((project, index) => (
                <View key={index} style={styles.projectContainer}>
                  <Text style={styles.projectName}>{project.project.name}</Text>
                  <View
                    style={[
                      styles.projectStatusContainer,
                      project.status === 'finished' && project['validated?']
                        ? styles.projectSuccess
                        : project.status === 'finished'
                        ? styles.projectFailure
                        : styles.projectOngoing,
                    ]}>
                    {project.status === 'finished' ? (
                      <Text style={styles.projectMark}>{project.final_mark}</Text>
                    ) : (
                      <Text style={styles.projectStatus}>{project.status}</Text>
                    )}
                  </View>
                </View>
              ))}
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  progressBarContainer: {
    position: 'relative',
    marginVertical: 5,
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressLabelContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressLabelContainerCursus: {
    position: 'absolute',
    left: 10,
    justifyContent: 'left',
    alignItems: 'left',
  },
  Text: {
    position: 'absolute',
    top: -10,
    justifyContent: 'center',
    alignItems: 'center',
    color: '#fff',
  },
  progressLabelText: {
    fontSize: 16,
    color: '#fff', // Définissez la couleur de texte que vous préférez
    fontWeight: 'bold',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  loginContainer: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 30,
    marginVertical: 10,
    backgroundColor: 'rgba(19, 15, 170, 0.8)',
    borderColor: '#fff',
    borderWidth: 1,
    borderRadius: 5,
  },
  avatarContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 0,
    borderColor: '#fff',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
  },
  avatarStyle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: 10,
  },
  textDescription: {
    color: '#fff',
    fontSize: 14,
  },
  achievementContainer: {
    flexDirection: 'row', // Ajout de cette ligne pour aligner les éléments horizontalement
    alignItems: 'center', // Ajout de cette ligne pour centrer verticalement les éléments
    borderColor: '#fff',
    borderWidth: 1,
    borderRadius: 5,
    padding: 5,
    marginVertical: 2,
    marginLeft: 20,
    marginRight: 20,
    backgroundColor: 'rgba(127, 124, 255, 0.5)',
  },
  achievementText: {
    color: '#fff',
    marginRight: 20,
  },
  achievementIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  sectionHeader: {
    padding: 10,
    borderColor: '#fff',
    borderWidth: 1,
    borderRadius: 5,
    marginVertical: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(19, 15, 170, 0.8)',
  },
  projectContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderColor: '#fff',
    borderWidth: 1,
    borderRadius: 5,
    padding: 2,
    marginVertical: 2,
    backgroundColor: 'rgba(127, 124, 255, 0.5)',
    marginLeft: 20,
    marginRight: 20,
  },
  projectName: {
    color: '#fff',
    flex: 1,
  },
  projectStatusContainer: {
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 5,
    padding: 5,
  },
  projectSuccess: {
    backgroundColor: 'green',
  },
  projectFailure: {
    backgroundColor: 'red',
  },
  projectOngoing: {
    backgroundColor: 'orange',
  },
  projectMark: {
    color: '#fff',
  },
  projectStatus: {
    color: '#fff',
  },
  skillContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderColor: '#fff',
    borderWidth: 1,
    borderRadius: 5,
    padding: 2,
    marginVertical: 2,
    backgroundColor: 'rgba(127, 124, 255, 0.5)',
    marginLeft: 20,
    marginRight: 20,
  },
  skillName: {
    color: '#fff',
  },
  skillLevel: {
    color: '#fff',
  },
  progressBarSkillContainer: {
    position: 'relative',
    marginVertical: 2,
    borderRadius: 5,
    overflow: 'hidden',
    marginLeft: 20,
    marginRight: 20,
  },
  progressLabelSkillContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  progressLabelSkillContainerCursus: {
    position: 'absolute',
    left: 10,
    top: 0, // Ajout de 'top: 0' pour positionner le conteneur correctement
    bottom: 0, // Ajout de 'bottom: 0' pour étirer le conteneur verticalement
    justifyContent: 'center', // Ajout de 'center' pour centrer le contenu verticalement
  },
  progressLabelSkillText: {
    fontSize: 14,
    color: '#fff', // Définissez la couleur de texte que vous préférez
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  errorText: {
    fontSize: 20,
    color: 'white',
    marginBottom: 20,
  },
});

export default StudentDetailScreen;
