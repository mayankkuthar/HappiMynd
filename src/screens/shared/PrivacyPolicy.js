import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

// Constatnts
import { colors } from "../../assets/constants";

// Components
import Header from "../../components/common/Header";

const policyContentData = [
  {
    id: 1,
    title: "Introduction",
    description:
      "At HappiMynd, we are committed to respecting the privacy and confidentiality of the information that you entrust us with. Our Privacy Policy outlines the policies and procedures regarding the collection, use and disclosure of Personal Information from users. Please review this Privacy Policy carefully. In order to guarantee privacy to the client, we maintain the client’s anonymity and work in accordance with confidentiality policies to ensure that all personal and health information received is maintained and transmitted through a highly secure environment. It is recommended that you do not use the website, mobile application(s) or the related Services if any of the terms of this Privacy Policy are not in accordance with the applicable laws of your country.",
  },
  {
    id: 2,
    title: "Definitions",
    description:
      "Company - “HappiMynd”, “HappiMynd.com”,“Company”, “Firm”, “we”, “our”, “us”, “Service Provider” or similar terminology are all in reference to HappiMynd Professional Services Pvt. Ltd. as a provider of Services for the remainder of this document. User - “Client”, “user”, “you”, “your” or other similar terminology are all in reference to you as the user of the platform as a recipient of our products, Services and resources for the remainder of this document. Platform-“Platform” or similar terminology are all in reference to any mobile app, website, chat bot or web links that the User can employ to access Services provided by the Company. Psychological Wellness Professional -“Psychological Wellness Practitioner”, “Psychological Wellness    Professional”, “Wellness Professional”, “therapist”, “wellness advisor”, “expert”, “doctor”, “consultant” or similar terminology are all in reference to the Psychological Wellness Practitioner.",
  },
  {
    id: 3,
    title: "Nature of Service",
    description:
      "HappiMynd is a psychological wellness platform that delivers emotional wellness products and Services to individuals and organisations. These include, but are not restricted to, corporate wellness programmes through which employees of organisations avail various products and Services. HappiMynd offerings may include/are: Screening on Emotional Wellbeing & Personality parameters, Self-assessments and psychological tests,Online and face-to-face consultation with expert Psychological Wellness Professionals (who have been authorised by HappiMynd to use the platform for delivering their Services),Workshops and/or webinars delivered by trained Psychological Wellness Professionals, Self-help tools, content and programmes through a range of channels including, but not restricted to websites, mobile applications and emails. Guide chat packs where in clients may be able to exchange encrypted private messages with their Psychological Wellness Professional in addition to online consultation, Content Library (Audio visuals, Blogs, Articles etc.)The Services offered by HappiMynd are in compliance with our client anonymity and confidentiality policies (refer to Privacy Policy). HappiMynd reserves the right to add or remove products and Services from its overall offerings without prior notification. The aforementioned shall hereinafter be referred to as “Services”.",
  },
  {
    id: 3.5,
    title: "Consent",
    description:
      "By using the platform, providing us your Personal Information or by making use of the features provided by the platform or by making a payment to HappiMynd, you hereby provide your consent to the collection, storage, processing, disclosure and transfer of your personal information in accordance with the provisions of this Privacy Policy. You acknowledge that you are providing your Personal Information out of your free will, either directly to HappiMynd or through a third-party or your organisation. You have the option to not provide us the personal information sought to be collected. You will also have an option to withdraw your consent at any point, provided such withdrawal of consent is intimated to us in writing to support@happimynd.com. Notwithstanding this, if you are accessing our platform through a third-party or your organisation, you will have an option to withdraw your consent at any point, provided you explicitly inform the third party or your organisation about such withdrawal of consent in writing, who would then inform us to take the appropriate action. If you do not provide us with your Personal Information or if you withdraw the consent at any point in time, we shall have the option to not fulfil the purposes for which the said Personal Information was sought and we may restrict your use of the platform.",
  },
  {
    id: 4,
    title: "Personal Information",
    description:
      "To enable you to engage with our Services, we will use personal information about yourself - provided directly to us or to a third party or your organisation - to contact or identify you, such as your name, phone number, emergency contact number, gender, occupation, hometown, personal interests, your email address, reason(s) for cancelling an appointment with a healthcare professional, medical history and any other information that the Wellness Professional might require from you. We also collect information you provide from responses, in-app inputs, assessments or the feedback you send to us. If you communicate with us by email or phone, any information provided in such communication may be collected as personal information (“Personal Information”).The main reason we collect this Personal Information is to provide you a smooth, efficient and customised experience. The collection of Personal Information also enables the user to create an account and profile that can be used to interact with our wellness professionals. You may change some of the information that you provide through your account page at the website or profile details for the mobile application(s).We may use your Personal Information to: Identify and reach you; Resolve service and billing problems via telephone or email. Assist you in scheduling appointments, remind you of upcoming or follow-up appointments, as well as cancelled appointments. Provide you with further information, products and services and newsletters. Better understand users’ needs and interests. Personalise your experience. Run statistical research (such research will only use your information in an anonymous way and cannot be linked back to you) Detect and protect us against error, fraud, and other criminal activity. Make disclosures as may be required under applicable law. Improve our website, mobile application(s) in order to better serve you. Allow us to better service you in responding to your customer service requests. Run a contest, promotion, survey or other site, mobile application feature. Quickly process your transactions. Your information is used by the Wellness Professionals and our app algorithms to better assess your condition and provide you with the most suitable counselling service or digital experience. Your Personal Information is held safe by the Wellness Professional working with you and not normally shared with other Wellness Professionals. However, there may be certain occasions when HappiMynd and/or Wellness Professionals use third-party tools to tailor the counselling sessions and in-app experience. In such cases, only minimal information as required is shared with others. We are dedicated to maintaining the privacy and integrity of your Personal Information. If you decide at any time that you no longer wish to receive certain communications from us, you can inform us by writing to support@happimynd.com.",
  },
  {
    id: 4.5,
    title: "Updating Personal Information",
    description:
      "If your Personal Information changes, or if you need to update or correct your Personal Information or have any grievance with respect to the processing or use of your Personal Information, for any reason, you may send updates and corrections to us at support@happimynd.com  and we will take all reasonable efforts to incorporate the changes within a reasonable period of time. If you provide your Personal Information to a third-party platform from which you are using our Services, HappiMynd may not be able to make any changes to the same and you will have to contact the third-party platform in order to update your Personal Information.If your Personal Information is stored as part of your profile on the platform, you can update your Personal Information from our website or mobile application(s). Some Personal Information, such as your answers to online assessments cannot be updated or deleted once submitted. If you would like us to remove your records from our system, please contact us at support@happimynd.com  and we will attempt to accommodate your request if we do not have any legal obligation to retain such information. Please note that we are required to retain certain information in keeping with professional standards or by law for record maintaining purposes (including but not limited to payment history, feedback, client information, etc.), so we will continue to store this information for a pre-specified period of time as per applicable laws, even if you delete your account. There may also be residual information that will remain within our databases and other records, which, irrespective of any efforts by us to delete information, will not be removed from them.",
  },
  {
    id: 5,
    title: "Cookies",
    description:
      "We use “cookies” to collect information and smoothen your experience on our platform. A cookie is a small data file that we transfer to your device’s hard disk for record-keeping purposes. We use cookies for two purposes. First, we may utilise persistent cookies to save your user credentials for future logins to the Services. Second, we may utilise session ID cookies to enable certain features of the Services, to better understand how you interact with the Services and to monitor aggregate usage by users of the Services and online traffic routing on the Services. Unlike persistent cookies, session cookies are deleted from your computer when you log off from the Services and then close your browser. We may work with third parties that place or read cookies on your browser to improve your user experience. In such cases, by using the third party services through our platform, you consent to their Privacy Policy and terms of use and agree not to hold HappiMynd liable for any issues arising from such use.You can instruct your browser, by changing its options, to stop accepting cookies or to prompt you before accepting a cookie from the websites you visit. If you do not accept cookies, however, you may not be able to use all features or functionalities of the platform.",
  },
  {
    id: 6,
    title: "Log Data",
    description:
      "When you visit the platform, our servers automatically record information that your browser or mobile application sends (“Log Data”). This Log Data may include information such as your computer’s Internet Protocol (“IP”) address, browser type, device name, operating system version, configuration of the app when accessing the Platform, the webpage you were visiting before you came to our Services, pages of our platform and Services that you visit, the time spent on those pages, information you search for on our Services, access times and dates, and other statistics. We use this information to analyse trends, administer the site, track your location, gather broad demographic information for aggregate use, increase user-friendliness and tailor our Services to better suit your needs.",
  },
  {
    id: 7,
    title: "Confidentiality",
    description:
      "HappiMynd maintains the confidentiality of information disclosed during personal consultation. Any information shared with HappiMynd is confidential and not shared with anyone, including your organization, with certain exceptions where confidentiality may be breached. The case where confidentiality will be breached is if: the Wellness Professional or HappiMynd perceives there to be a serious and/or significant and/or imminent risk of harm to the health or safety of a person or the public or self; disclosure is required by law; you file a private healthcare claim and the insurer requires information. Except for the reasons outlined above, the Personal Information shared on HappiMynd will only be shared with others after permission has been granted by you orally or by way of email/letter/fax. All staff members of HappiMynd, including all HappiMynd professionals, employees, contracted professionals or trainees, are required to follow this confidentiality policy. The User agrees to indemnify HappiMynd for any breach in confidentiality of the User’s Personal Information. If the User accesses HappiMynd through a third-party platform the User indemnifies HappiMynd against any data breaches that occur due to any acts of commission or omission from the third-party platform.",
  },
  {
    id: 8,
    title: "Third Party Disclosure",
    description:
      "HappiMynd does not sell or trade your Personal Information to third parties unless we provide you with advance notice. This however does not apply to any storage or transfer to and from server/website hosting partners and other parties who assist us in operating our platform, conducting our business, or servicing you. We may also release your information when we believe release is appropriate to comply with the law, enforce our site policies, mobile application policies, or protect ours or others’ rights, property, or safety. However, visitor information that is not personally identifiable may be provided to other parties for marketing, advertising, or other uses.",
  },
  {
    id: 9,
    title: "Security",
    description:
      "We employ administrative, physical, and technical measures designed to safeguard and protect information under our control from unauthorised access, use, and disclosure. When we collect, maintain, access, use, or disclose your Personal Information, we will do so using systems and processes consistent with industry standards in information privacy and security. In keeping with professional standards, Wellness Professionals might be required to maintain records of both online and offline sessions. In spite of the security measures undertaken by us, we strongly discourage you from posting your Personal Information in forums, comments or any other publicly accessible places on our platform. HappiMynd shall not be held responsible for use or misuse of any information pertaining to or shared by the User with relation to its Services. The User will not hold HappiMynd liable for any issue related to data storage and/or security. It is your responsibility to ensure the privacy and security of your email account and phone messages so they cannot be accessed by third-party. HappiMynd will use one or both of these channels to communicate with you regarding a range of information related to your psychological wellness. HappiMynd shall not be liable for any breach in confidentiality, should your email or text messages be accessed by a third-party, with or without your consent.",
  },
  {
    id: 10,
    title: "Links",
    description:
      "The platform may contain links to other third party sites. The third party sites are not necessarily under the control of HappiMynd. Please note that HappiMynd is not responsible for the privacy practices of such third party sites. HappiMynd encourages you to be aware when you leave the platform and to read the privacy policies of each and every third party site or mobile application that collects Personal Information. If you decide to access any of the third-party sites linked to the platform, you do this entirely at your own risk. Any links to any partner websites is the responsibility of the linking party, and HappiMynd shall not be responsible for notification of any change in name or location of any information on the websites. HappiMynd is not responsible for the use of any Personal Information that you voluntarily disclose through a forum or through the platform.",
  },
  {
    id: 11,
    title: "Minimum Age",
    description:
      "Our Services, website, and mobile application(s) are not directed to persons under the age of 18 years. We do not knowingly solicit anyone under the age of 18 to participate independently in any of our Services. By choosing to visit and/or avail any Services and/or product and/or resource from HappiMynd, the user confirms that they are above 18 years of age and are not otherwise incompetent to contract under the Indian Contract Act, 1872 and are legally allowed to take decisions of their own. If You are between 13 and 18 years of age, please read through HappiMynd Privacy Policy and the HappiMynd Terms of Service with Your parent or legal guardian, and in such a case the Agreement shall be deemed to be a contract between HappiMynd and Your legal guardian or parent and to the extent permissible under applicable laws, enforceable against You. Anyone under 13 is strictly prohibited from creating an account and/or Using the Service.If Your Institution specifies a different age restriction, such as at least 18 and above, as a condition of using this Service, that restriction shall apply rather than the one above.",
  },
  {
    id: 12,
    title: "Changes to Policy",
    description:
      "HappiMynd reserves the right to change or remove any part of the Privacy Policy without notice or liability to any third party. In the event there are significant changes in the way we treat your Personal Information, or in the Privacy Policy, we may take reasonable effort, but are in no way obligated, to display a notice on the website or send you an email, so that you may review the changed terms prior to continuing to use the platform.As always, if you object to any of the changes to our terms, and you no longer wish to use the platform, you can contact HappiMynd to discontinue using our platform and deactivate your account if you are registered with us directly. If you are signed up on our platform using a third-party platform or are accessing our Services through your employer, then in order to deactivate your account or no longer use our Services, you will have to contact the third party platform or your employer.Unless stated otherwise, our current Privacy Policy applies to all information that HappiMynd has about you and your account. Using the Services on the websites, mobile application(s) or accessing the websites, mobile application(s) after a notice of change has been sent to you or published on our website shall constitute your consent to the changed terms.",
  },
  {
    id: 13,
    title: "Grievance Redressal",
    description:
      "To address the grievances of the users, HappiMynd has set up a Grievance Redressal Forum. In case you are dissatisfied with any aspect of our Services, you may contact our Grievance Redressal Officer Ravi Kant Suman at support@happimynd.com. We assure you a time bound solution not exceeding one month from the date of your complaint.",
  },
  {
    id: 14,
    title: "Contact Information",
    description:
      "Registered Address: \n Sec-49, Vatika City, \n Gurugram -122018 \n E-mail id: support@happimynd.com",
  },
];

const PolicyContent = (props) => {
  //Prop Destructuring
  const { title, description } = props;

  return (
    <View>
      <Text style={styles.PolicyTitle}>{title}</Text>

      {/* Sized Box */}
      <View style={{ height: hp(1) }} />

      <Text style={styles.PolicyDescription}>{description}</Text>
    </View>
  );
};

const PrivacyPolicy = (props) => {
  // Prop Destructuring
  const { navigation } = props;
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
          <Text style={styles.title}>Privacy Policy</Text>
        </View>

        {/* Sized Box */}
        <View style={{ height: hp(4) }} />

        {/* Body Section */}
        <View>
          {policyContentData.map((data) => (
            <View key={data.id}>
              <PolicyContent
                title={data.title}
                description={data.description}
              />
              {/* Sized Box */}
              <View style={{ height: hp(4) }} />
            </View>
          ))}
        </View>
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
  PolicyTitle: {
    fontSize: RFValue(22),
    fontFamily: "PoppinsMedium",
  },
  PolicyDescription: {
    fontSize: RFValue(12),
    fontFamily: "Poppins",
    color: colors.borderDark,
    lineHeight: hp(3),
    textAlign: "justify",
  },
});

export default PrivacyPolicy;
