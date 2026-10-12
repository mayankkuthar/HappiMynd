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
  Share,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { MaterialIcons } from "@expo/vector-icons";
import { Svg, Path } from "react-native-svg";
import * as FileSystem from "expo-file-system";

// Constants
import { colors } from "../../assets/constants";
import { Hcontext } from "../../context/Hcontext";

// Components
const DownloadIcon = ({ size = hp(3), color = "#111111" }) => (
  <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <Path
      d="M8 12L3 7L4.4 5.55L7 8.15V0H9V8.15L11.6 5.55L13 7L8 12ZM2 16C1.45 16 0.979167 15.8042 0.5875 15.4125C0.195833 15.0208 0 14.55 0 14V11H2V14H14V11H16V14C16 14.55 15.8042 15.0208 15.4125 15.4125C15.0208 15.8042 14.55 16 14 16H2Z"
      fill={color}
    />
  </Svg>
);

const AllReports = ({ navigation }) => {
  // Context Variables
  const { authState, screenTrafficAnalytics, getAllReport, getReport } =
    useContext(Hcontext);

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
   * Extract the reports list from a response object
   * @param {Object} response - The API response
   * @returns {Array|null} The reports array or null if not found
   */
  const extractReports = (response) =>
    Array.isArray(response)
      ? response
      : Array.isArray(response?.data)
      ? response.data
      : Array.isArray(response?.reports)
      ? response.reports
      : Array.isArray(response?.result)
      ? response.result
      : null;

  /**
   * Fetch all reports from the API
   * Sets the reports state and handles loading states
   */
  const fetchReports = async () => {
    try {
      setLoading(true);
      let response = await getAllReport();
      console.log("All reports response:", response);
      let list = extractReports(response);
      if (!list || list.length === 0) {
        console.log("No reports found, attempting to generate...");
        try {
          const genRes = await getReport();
          console.log("getReport response:", genRes);
          if (genRes?.status === "success") {
            const reportUrl = genRes?.url || genRes?.data?.url;
            response = await getAllReport();
            list = extractReports(response);
            if ((!list || list.length === 0) && reportUrl) {
              list = [
                {
                  id: Date.now(),
                  report: reportUrl,
                  created_at:
                    genRes?.created_at || new Date().toISOString(),
                },
              ];
            }
          }
        } catch (genErr) {
          console.error("Error generating report:", genErr);
        }
      }
      if (list) {
        setReports(list);
      } else {
        createOneButtonAlert(response?.message || "Failed to fetch reports");
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
   * Format a date string to the requested timestamp format (e.g. 03/23/26 at 10:59:35)
   * @param {string} dateString - The date string to format
   * @returns {string} The formatted timestamp
   */
  const formatTimestamp = (dateString) => {
    const date = new Date(dateString);
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    const yy = String(date.getFullYear()).slice(-2);
    const hh = String(date.getHours()).padStart(2, "0");
    const min = String(date.getMinutes()).padStart(2, "0");
    const ss = String(date.getSeconds()).padStart(2, "0");
    return `${mm}/${dd}/${yy} at ${hh}:${min}:${ss}`;
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
      <View style={styles.reportItem}>
        <View style={styles.reportInfo}>
          <Text style={styles.reportTitle}>Report #{index + 1}</Text>
          <Text style={styles.reportTimestamp}>
            {formatTimestamp(item.created_at)}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.downloadButton}
          activeOpacity={0.7}
          onPress={() => handleDownload(item.report)}
        >
          <DownloadIcon size={hp(2.2)} color="#111111" />
        </TouchableOpacity>
      </View>
    );
  };

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
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="chevron-left" size={22} color="#494650" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Report Details</Text>
      </View>

      {loading && !refreshing ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading your reports...</Text>
        </View>
      ) : (
        <FlatList
          data={reports}
          renderItem={renderReportItem}
          keyExtractor={(item, index) => String(item?.id ?? index)}
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
    backgroundColor: "#F8F7FF",
    paddingTop: hp(6),
  },
  header: {
    width: wp(100),
    paddingHorizontal: wp(4),
    paddingBottom: hp(2),
  },
  headerTitle: {
    fontSize: RFValue(26),
    fontFamily: "Poppins",
    fontWeight: "400",
    color: "#9747FF",
    marginTop: hp(1),
  },
  listContainer: {
    paddingHorizontal: wp(4),
    paddingBottom: hp(2),
    flexGrow: 1,
  },
  reportItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#EBD9FF",
    borderColor: "#D8CDE4",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 22,
    paddingVertical: 22,
    marginBottom: 8,
  },
  reportInfo: {
    flex: 1,
  },
  reportTitle: {
    fontFamily: "Poppins",
    fontWeight: "400",
    fontSize: RFValue(14),
    color: "#111111",
    marginBottom: hp(0.5),
  },
  reportTimestamp: {
    fontFamily: "Poppins",
    fontWeight: "400",
    fontSize: RFValue(12),
    color: "#111111",
  },
  downloadButton: {
    justifyContent: "center",
    alignItems: "center",
    marginLeft: hp(2),
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