import React, { useState, useContext, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import Collapsible from "react-native-collapsible";
import { Entypo } from "@expo/vector-icons";
import RenderHtml from "react-native-render-html";

// Constatnts
import { colors } from "../../assets/constants";
import { Hcontext } from "../../context/Hcontext";

// Components
import Header from "../../components/common/Header";

const faqData = [
  {
    id: 1,
    question: "What is HappiMynd?",
    answer:
      "HappiMynd is an online platform built with an aim to create awareness and provide comprehensive support to people seeking emotional and psychological wellness. We offer a unique 5 stage solution based on Awareness, Prevention, Early Detection, Self-Management and Therapeutic Treatment for Mental Wellness and related issues through positive aspects of psychology before they become life-alerting. Our goal is to be the first point of contact and help people achieve emotional wellbeing and resolve any of their emotional problems before it snowballs into a physical or psychological ailment. Our services include: HappiLIFE – A globally validated screening summary based on 10 parameters with assisted summary reading. HappiBUDDY- Self-help content library with chat support offered by our experts HappiAPP- A 100% Confidential, Anonymous, Secure, Research and Evidence-based Self-Help App for enhancing emotional well-being. The app is trusted by 3.8 million users in 2800+ organizations. HappiTALK – Anonymous, Confidential, Affordable and Reliable online counselling with top experts. HappiSPACE – A comprehensive 5 stage online customized organizational package for the emotional well-being of employees, patrons or scholars. Visit the Services section to know more.",
  },
  {
    id: 2,
    question:
      "Is my information shared with anyone? Does HappiMynd ensure confidentiality?",
    answer:
      "HappiMynd does not seek any personal information without your approval. You can be sure of 100% confidentiality. The experts will not ask for your personal information in any case. They will refer to you by your provided nickname. You can also refer to our Privacy Policy for additional information.",
  },
  {
    id: 3,
    question: "Are HappiMynd’s services effective?",
    answer:
      "HappiMynd’s services are authentic, reliable, confidential and secure. We have appointed a team of certified psychologists through multiple layers of screening based on various aspects of psychology. Whereas, HappiAPP is a globally accredited and NHS approved smartphone app, currently being used by 3.8 million users across the globe. Our tools are matching internationally recognised security standards. We use Google Cloud Healthcare servers for the utmost protection of data and information.",
  },
  {
    id: 4,
    question: "Are HappiMynd’s therapists reliable?",
    answer:
      "HappiMynd has multiple layers of screening process. We assess our therapists on various parameters like their education, experience, behaviour, attitude, etc. All of our therapists are RCI registered and best in class.",
  },
  {
    id: 5,
    question: "How HappiMynd will help me achieve overall wellbeing?",
    answer:
      "Overall wellbeing is a combination of physical wellbeing and mental wellbeing. Mostly we tend to ignore mental wellness and take care of our physical wellness. However, our mental wellness impacts our physical wellness a great deal. HappiMynd’s approach is to make mental wellness as a part of everyone’s life and inspire people to take concrete steps toward mental wellness. When you take care of your mental wellness, physical wellness also aligns to achieve overall wellbeing.",
  },
  {
    id: 6,
    question:
      "Do I have to sign up for using HappiMynd’s website and services?",
    answer:
      "HappiMynd’s website is open to everyone. To avail any of our services, you would have to register with your nickname without revealing your identity. It is our effort to maintain anonymity and utmost confidentiality.",
  },
  {
    id: 7,
    question: "How old do I need to be to avail HappiMynd’s services?",
    answer:
      "HappiMynd’s services can be availed by anyone who is 18 years or older. Scholars older than 13 years can also avail our services but with a written consent from their parents or guardian.",
  },
  {
    id: 8,
    question: "Can I access HappiMynd on my phone and laptop?",
    answer:
      "HappiMynd’s services can be easily accessed through your phone or laptop. HappiAPP, however, is a smartphone application which can only be used on a phone powered by Android or iOS.",
  },
  {
    id: 9,
    question:
      "How should I choose a service for managing my emotional and mental wellbeing?",
    answer:
      "The first step is to know where you stand! HappiLIFE is an exercise which will help you to know different facets of your personality along with your emotional well-being, personality strengths and area of opportunities. You can avail our guided Screening reading by our counsellor for expert guidance. Once you know your current state, you can either choose HappiBUDDY, HappiSELF or HappiTALK based on your need. You can also ‘Contact Us’ for further assistance.",
  },
  {
    id: 10,
    question: "What makes HappiMynd unique?",
    answer:
      "HappiMynd is a unique platform that offers an array of mental wellness services under one roof, which were till now disorganized. We have an approach that strives to strengthen the positives rather than dwelling on the negatives. We have established a 5 stage solution around Awareness, Prevention, Early Detection, Self-Management and Therapeutic Treatment for Mental Wellness and related issues through positive aspects of psychology. Our Screenings are profile-based and customised to give our users a personalised experience. It is a new approach that is developed by HappiMynd.",
  },
  {
    id: 11,
    question: "Does HappiMynd conduct any live sessions?",
    answer:
      "Yes, HappiMynd conducts webinars, expert talks, podcasts, etc. from time to time. Interested people can join the sessions. Details will be updated on our website regularly.",
  },
  {
    id: 12,
    question: "Can I get a refund?",
    answer: "We do not have any policy for refunds or cancellations.",
  },
  {
    id: 13,
    question: "What is the duration of services?",
    answer:
      "Duration of service will depend on its nature. HappiLIFE is a one-time service. HappiBUDDY and HappiSELF are subscription plans. The frequency of HappiTALK sessions will depend on the plan that you’ve chosen. Duration of HappiSPACE services will be decided by your organization. You can visit our ‘Services’ section on our website for more details.",
  },
  {
    id: 14,
    question:
      "My bank account has been debited but I have not received any payment confirmation from HappiMynd. What should I do?",
    answer:
      "This usually happens when the bank delays in sending us an acknowledgement. You can either contact your bank’s customer service or drop us an e-mail to contactus@happimynd.com. We will help you as soon as possible. If the payment is made, your money is safe with us.",
  },
];

const Question = (props) => {
  // Prop Destructuring
  const { title, content } = props.data;

  // State variables
  const [isCollapsed, setIsCollapsed] = useState(true);

  // Prototype defination to replace multiple characters from String
  String.prototype.allReplace = function (obj) {
    var retStr = this;
    for (var x in obj) {
      retStr = retStr.replace(new RegExp(x, "g"), obj[x]);
    }
    return retStr;
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={styles.questionContainer}
      onPress={() => setIsCollapsed((prevState) => !prevState)}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text style={styles.questionText}>{title}</Text>
        <TouchableOpacity
          // style={{ backgroundColor: "red" }}
          activeOpacity={0.7}
          onPress={() => setIsCollapsed((prevState) => !prevState)}
        >
          <Entypo
            name={isCollapsed ? "chevron-down" : "chevron-up"}
            size={hp(2.5)}
            color="black"
          />
        </TouchableOpacity>
      </View>
      <Collapsible collapsed={isCollapsed}>
        {/* Sized Box */}
        <View style={{ height: hp(2) }} />

        <Text style={styles.answerText}>
          {content.allReplace({
            "<p>": "",
            "</p>": "",
            '<a href="mailto:support@happimynd.com">': "",
            '<a href="mailto:contactus@happimynd.com">': "",
            "</a>": "",
            "&nbsp;": "",
            "&amp;": "&",
          })}
        </Text>
        {/* <RenderHtml
          // contentWidth={wp(100)}
          source={{ html: content }}
        /> */}
      </Collapsible>
    </TouchableOpacity>
  );
};

const FAQ = (props) => {
  // Prop Destructuring
  const { navigation } = props;

  // Context Variables
  const { getFAQ } = useContext(Hcontext);

  // State Variables
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);

  // Mounting
  useEffect(() => {
    fetchFAQList();
  }, []);

  // Getting FAQ list from server
  const fetchFAQList = async () => {
    setLoading(true);
    try {
      const faqList = await getFAQ();
      // console.log("The fetched FAQ list is - ", faqList);

      if (faqList.status === "success") {
        setList(faqList.general_faqs);
      }
    } catch (err) {
      console.log("Some issue while getting FAQ list - ", err);
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Header navigation={navigation} />
      <ScrollView
        style={{ paddingHorizontal: wp(6) }}
        showsVerticalScrollIndicator={false}
      >
        {/* Sized Box */}
        <View style={{ height: hp(3) }} />

        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>Frequently Asked Questions</Text>
        </View>

        {/* Sized Box */}
        <View style={{ height: hp(2) }} />

        {/* Body Section */}
        {loading ? (
          <ActivityIndicator size="small" color={colors.loaderColor} />
        ) : (
          <View>
            {list.map((data) => (
              <View key={data.id}>
                <Question data={data} />
                {/* Sized Box */}
                <View style={{ height: hp(1.5) }} />
              </View>
            ))}
          </View>
        )}

        {/* Sized Box */}
        <View style={{ height: hp(5) }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  titleSection: {
    // backgroundColor: "red",
  },
  title: {
    fontSize: RFValue(26),
    fontFamily: "PoppinsSemiBold",
    color: colors.pageTitle,
  },
  questionContainer: {
    backgroundColor: "#E9FCFB",
    borderWidth: 1,
    borderColor: "#DDF1F0",
    borderRadius: 4,
    paddingVertical: hp(1),
    paddingHorizontal: hp(1.5),
  },
  questionText: {
    fontSize: RFValue(12),
    fontFamily: "Poppins",
    color: colors.borderDark,
    textAlign: "justify",
  },
  answerText: {
    fontSize: RFValue(12),
    fontFamily: "PoppinsMedium",
    lineHeight: hp(3),
    textAlign: "justify",
  },
});

export default FAQ;
