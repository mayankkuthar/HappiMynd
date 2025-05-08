import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Linking,
  Platform,
  Alert,
  ActivityIndicator,
  RefreshControl,
  Share
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";

// Constants
import { colors } from "../../assets/constants";
import { Hcontext } from "../../context/Hcontext";

// Components
import Header from "../../components/common/Header";

const AllReports = ({ navigation }) => {
  // Context Variables
  const { authState, screenTrafficAnalytics, getAllReport } = useContext(Hcontext);

  // State Variables
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    screenTrafficAnalytics({
      screenName: "HappiLIFE Reports Screen",
    });
    fetchReports();
  }, []);

  /**
   * Fetch all reports from the API
   * Sets the reports state and handles loading states
   */
  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await getAllReport();
      if (response && response.status === "success") {
        setReports(response.data);
      } else {
        createOneButtonAlert("Failed to fetch reports");
      }
    } catch (error) {
      console.error("Error fetching reports:", error);
      createOneButtonAlert("Error loading reports");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  /**
   * Handle pull-to-refresh functionality
   * Sets refreshing state and triggers a reports fetch
   */
  const onRefresh = () => {
    setRefreshing(true);
    fetchReports();
  };

  /**
   * Display an alert with a single OK button
   * @param {string} message - The message to display in the alert
   */
  const createOneButtonAlert = (message) => 
    Alert.alert("Report Status", message, [
      { text: "OK", onPress: () => console.log("OK Pressed") },
    ]);

  /**
   * Format a date string to a more readable format (e.g. Jan 1, 2025)
   * @param {string} dateString - The date string to format
   * @returns {string} The formatted date
   */
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  /**
   * Format a date string to display only the time (e.g. 12:30 PM)
   * @param {string} dateString - The date string to format
   * @returns {string} The formatted time
   */
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  /**
   * Download a report for Android devices
   * Saves the report to the document directory
   * @param {string} url - The URL of the report to download
   */
  const downloadReportAndroid = async (url) => {
    FileSystem.downloadAsync(url, FileSystem.documentDirectory + "report.pdf")
      .then(({ uri }) => {
        console.log("Finished downloading to ", uri);
        createOneButtonAlert("Report Successfully Downloaded");
      })
      .catch((error) => {
        console.error("Some issue while downloading file - ", error);
        createOneButtonAlert("Report Download Failed");
      });
  };

  /**
   * Download a report for iOS devices
   * Creates a directory if it doesn't exist, downloads the file,
   * and shares it with the user
   * @param {string} url - The URL of the report to download
   */
  const downloadReportIOS = async (url) => {
    try {
      const directory = FileSystem.documentDirectory + 'happimynd/';

      // Ensure the directory exists
      const dirInfo = await FileSystem.getInfoAsync(directory);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(directory, { intermediates: true });
      }

      const fileUri = directory + 'report.pdf';

      const { uri } = await FileSystem.downloadAsync(url, fileUri);
      console.log('Finished downloading to ', uri);
      createOneButtonAlert('Report Successfully Downloaded');

      // Share the downloaded file
      const mimeType = 'application/pdf';
      shareFile(uri, mimeType);
    } catch (error) {
      console.error('Some issue while downloading file - ', error);
      createOneButtonAlert('Report Download Failed');
    }
  };

  /**
   * Platform-specific download handler
   * Determines which download function to use based on the device platform
   * @param {string} url - The URL of the report to download
   */
  const handleDownload = (url) => {
    Linking.openURL(url)
    if (Platform.OS === 'ios') {
      downloadReportIOS(url);
    } else {
      downloadReportAndroid(url);
    }
  };

  /**
   * Share a downloaded file with other apps
   * @param {string} fileUri - The local URI of the file to share
   * @param {string} mimeType - The MIME type of the file (e.g., 'application/pdf')
   */
  const shareFile = async (fileUri, mimeType) => {
    try {
      const options = {
        mimeType: mimeType,
        dialogTitle: 'Share file',
        UTI: 'public.data',
      };
      await Share.share({ url: fileUri }, options);
    } catch (error) {
      console.error('Error sharing file:', error.message);
    }
  };

  /**
   * Render a single report item in the list
   * @param {Object} params - The params object
   * @param {Object} params.item - The report item data
   * @param {number} params.index - The index of the item in the list
   * @returns {JSX.Element} The rendered report item
   */
  const renderReportItem = ({ item, index }) => {
    return (
      <View 
        style={[
          styles.reportItem, 
          index % 2 === 0 ? styles.evenRow : styles.oddRow
        ]}
      >
        <View style={styles.reportInfo}>
          <Text style={styles.reportId}>Report #{index+1}</Text>
          <Text style={styles.reportDate}>
            {formatDate(item.created_at)} at {formatTime(item.created_at)}
          </Text>
        </View>
        <TouchableOpacity 
          style={styles.downloadButton}
          activeOpacity={0.7}
          onPress={() => handleDownload(item.report)}
        >
          <MaterialIcons name="file-download" size={hp(3.5)} color={colors.primary} />
        </TouchableOpacity>
      </View>
    );
  };

  /**
   * Render the header for the reports list
   * @returns {JSX.Element} The header component
   */
  const ListHeader = () => (
    <View style={styles.tableHeader}>
      <Text style={styles.headerText}>Report Details</Text>
      <Text style={styles.headerText}>Download</Text>
    </View>
  );

  /**
   * Render an empty state when no reports are available
   * @returns {JSX.Element} The empty state component
   */
  const EmptyList = () => (
    <View style={styles.emptyContainer}>
      <MaterialIcons name="description" size={hp(10)} color={colors.lightGray} />
      <Text style={styles.emptyText}>No reports available</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header title="HappiLIFE Reports" navigation={navigation} showBackButton />
      
      {loading && !refreshing ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading your reports...</Text>
        </View>
      ) : (
        <FlatList
          data={reports}
          renderItem={renderReportItem}
          keyExtractor={(item) => item.id.toString()}
          ListHeaderComponent={reports.length > 0 ? ListHeader : null}
          ListEmptyComponent={EmptyList}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors.primary]}
            />
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContainer: {
    paddingHorizontal: wp(4),
    paddingBottom: hp(2),
    flexGrow: 1,
  },
  tableHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(3),
    backgroundColor: colors.primary,
    borderRadius: 8,
    marginVertical: hp(2),
  },
  headerText: {
    color: "white",
    fontFamily: "PoppinsSemiBold",
    fontSize: RFValue(14),
  },
  reportItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: hp(2),
    paddingHorizontal: wp(3),
    borderRadius: 8,
    marginBottom: hp(1.5),
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  evenRow: {
    backgroundColor: "#fff",
  },
  oddRow: {
    backgroundColor: "#f9f9f9",
  },
  reportInfo: {
    flex: 1,
  },
  reportId: {
    fontFamily: "PoppinsSemiBold",
    fontSize: RFValue(14),
    color: "#333",
    marginBottom: hp(0.5),
  },
  reportDate: {
    fontFamily: "PoppinsRegular",
    fontSize: RFValue(12),
    color: "#666",
  },
  downloadButton: {
    width: hp(5),
    height: hp(5),
    borderRadius: hp(2.5),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f8ff",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: hp(2),
    fontFamily: "PoppinsRegular",
    fontSize: RFValue(14),
    color: "#666",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: hp(10),
  },
  emptyText: {
    marginTop: hp(2),
    fontFamily: "PoppinsMedium",
    fontSize: RFValue(16),
    color: colors.lightGray,
  },
});

export default AllReports;