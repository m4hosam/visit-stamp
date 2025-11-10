import { Colors } from "@/constants/Colors";
import React, { useState } from "react";
import {
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export interface Country {
  code: string;
  name: string;
  dialCode: string;
  flag: string;
}

const countries: Country[] = [
  {
    code: "EG",
    name: "Egypt",
    dialCode: "+20",
    flag: "https://flagcdn.com/w20/eg.png",
  },
  {
    code: "US",
    name: "United States",
    dialCode: "+1",
    flag: "https://flagcdn.com/w20/us.png",
  },
  {
    code: "CA",
    name: "Canada",
    dialCode: "+1",
    flag: "https://flagcdn.com/w20/ca.png",
  },
  {
    code: "GB",
    name: "United Kingdom",
    dialCode: "+44",
    flag: "https://flagcdn.com/w20/gb.png",
  },
  {
    code: "AU",
    name: "Australia",
    dialCode: "+61",
    flag: "https://flagcdn.com/w20/au.png",
  },
  {
    code: "DE",
    name: "Germany",
    dialCode: "+49",
    flag: "https://flagcdn.com/w20/de.png",
  },
  {
    code: "FR",
    name: "France",
    dialCode: "+33",
    flag: "https://flagcdn.com/w20/fr.png",
  },
  {
    code: "IT",
    name: "Italy",
    dialCode: "+39",
    flag: "https://flagcdn.com/w20/it.png",
  },
  {
    code: "ES",
    name: "Spain",
    dialCode: "+34",
    flag: "https://flagcdn.com/w20/es.png",
  },
  {
    code: "NL",
    name: "Netherlands",
    dialCode: "+31",
    flag: "https://flagcdn.com/w20/nl.png",
  },
  {
    code: "BE",
    name: "Belgium",
    dialCode: "+32",
    flag: "https://flagcdn.com/w20/be.png",
  },
  {
    code: "CH",
    name: "Switzerland",
    dialCode: "+41",
    flag: "https://flagcdn.com/w20/ch.png",
  },
  {
    code: "AT",
    name: "Austria",
    dialCode: "+43",
    flag: "https://flagcdn.com/w20/at.png",
  },
  {
    code: "SE",
    name: "Sweden",
    dialCode: "+46",
    flag: "https://flagcdn.com/w20/se.png",
  },
  {
    code: "NO",
    name: "Norway",
    dialCode: "+47",
    flag: "https://flagcdn.com/w20/no.png",
  },
  {
    code: "DK",
    name: "Denmark",
    dialCode: "+45",
    flag: "https://flagcdn.com/w20/dk.png",
  },
  {
    code: "FI",
    name: "Finland",
    dialCode: "+358",
    flag: "https://flagcdn.com/w20/fi.png",
  },
  {
    code: "JP",
    name: "Japan",
    dialCode: "+81",
    flag: "https://flagcdn.com/w20/jp.png",
  },
  {
    code: "KR",
    name: "South Korea",
    dialCode: "+82",
    flag: "https://flagcdn.com/w20/kr.png",
  },
  {
    code: "CN",
    name: "China",
    dialCode: "+86",
    flag: "https://flagcdn.com/w20/cn.png",
  },
  {
    code: "IN",
    name: "India",
    dialCode: "+91",
    flag: "https://flagcdn.com/w20/in.png",
  },
  {
    code: "BR",
    name: "Brazil",
    dialCode: "+55",
    flag: "https://flagcdn.com/w20/br.png",
  },
  {
    code: "MX",
    name: "Mexico",
    dialCode: "+52",
    flag: "https://flagcdn.com/w20/mx.png",
  },
  {
    code: "AR",
    name: "Argentina",
    dialCode: "+54",
    flag: "https://flagcdn.com/w20/ar.png",
  },
  {
    code: "CL",
    name: "Chile",
    dialCode: "+56",
    flag: "https://flagcdn.com/w20/cl.png",
  },
  {
    code: "CO",
    name: "Colombia",
    dialCode: "+57",
    flag: "https://flagcdn.com/w20/co.png",
  },
  {
    code: "PE",
    name: "Peru",
    dialCode: "+51",
    flag: "https://flagcdn.com/w20/pe.png",
  },
  {
    code: "ZA",
    name: "South Africa",
    dialCode: "+27",
    flag: "https://flagcdn.com/w20/za.png",
  },
  {
    code: "NG",
    name: "Nigeria",
    dialCode: "+234",
    flag: "https://flagcdn.com/w20/ng.png",
  },
  {
    code: "KE",
    name: "Kenya",
    dialCode: "+254",
    flag: "https://flagcdn.com/w20/ke.png",
  },
];

interface CountryPickerProps {
  selectedCountry: Country;
  onCountrySelect: (country: Country) => void;
  style?: any;
}

export const CountryPicker: React.FC<CountryPickerProps> = ({
  selectedCountry,
  onCountrySelect,
  style,
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleCountrySelect = (country: Country) => {
    onCountrySelect(country);
    setModalVisible(false);
  };

  return (
    <>
      <TouchableOpacity
        style={[styles.countrySelector, style]}
        onPress={() => setModalVisible(true)}
      >
        <Image source={{ uri: selectedCountry.flag }} style={styles.flag} />
        <Text style={styles.dialCode}>{selectedCountry.dialCode}</Text>
        <Text style={styles.dropdownArrow}>▼</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="none"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Country</Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.countryList}>
              {countries.map((country) => (
                <TouchableOpacity
                  key={country.code}
                  style={[
                    styles.countryItem,
                    selectedCountry.code === country.code &&
                      styles.selectedCountryItem,
                  ]}
                  onPress={() => handleCountrySelect(country)}
                >
                  <Image
                    source={{ uri: country.flag }}
                    style={styles.countryFlag}
                  />
                  <Text style={styles.countryName}>{country.name}</Text>
                  <Text style={styles.countryDialCode}>{country.dialCode}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  countrySelector: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.light.background,
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 16,
    minWidth: 100,
  },
  flag: {
    width: 20,
    height: 15,
    marginRight: 8,
  },
  dialCode: {
    fontSize: 16,
    color: Colors.light.text,
    marginRight: 8,
  },
  dropdownArrow: {
    fontSize: 15,
    color: Colors.light.text,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 20,
    width: "90%",
    maxHeight: "80%",
    overflow: "hidden",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.light.secondary,
  },
  closeButton: {
    padding: 5,
  },
  closeButtonText: {
    fontSize: 18,
    color: "#9CA3AF",
  },
  countryList: {
    maxHeight: 400,
  },
  countryItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  selectedCountryItem: {
    backgroundColor: "#F0FDF4",
  },
  countryFlag: {
    width: 24,
    height: 18,
    marginRight: 12,
  },
  countryName: {
    flex: 1,
    fontSize: 16,
    color: "#374151",
  },
  countryDialCode: {
    fontSize: 16,
    color: "#6B7280",
    fontWeight: "500",
  },
});

export { countries };
