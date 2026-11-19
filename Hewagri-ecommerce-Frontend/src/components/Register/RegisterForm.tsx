"use client";

import { useToast } from "@/context";
import { useAppDispatch, useAppSelector } from "@/lib/hook";
import { registerUser, setStatus } from "@/lib/redux/slices/authSlice";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import TextInput from "./TextInput";
import TextSelect from "./TextSelect";
import { fetchProvinces } from "@/lib/redux/slices/provincesSlice";
import { fetchTerritoires } from "@/lib/redux/slices/territoireSlice";
import { fetchVillages } from "@/lib/redux/slices/villagesSlice";
import Link from "next/link";

interface FormData {
  nom: string;
  postnom: string;
  prenom: string;
  email: string;
  phone: string;
  adresse: string;
  hectare_cultive: string;
  idprovince: string;
  idterritoire: string;
  idvillage: string;
  date_naiss: string;
  genre: string;
  password: string;
  confirmPassword: string;
}

const RegisterForm = () => {
  const [step, setStep] = useState(1);
  const router = useRouter();
  const notify = useToast();
  const dispatch = useAppDispatch();
  const { provinces } = useAppSelector((state) => state.provinces);
  const { territoires } = useAppSelector((state) => state.territoires);
  const { villages } = useAppSelector((state) => state.villages);

  useEffect(() => {
    dispatch(fetchProvinces());
    dispatch(fetchTerritoires());
    dispatch(fetchVillages());
  }, [dispatch]);

  const { loading, status, message, data, error } = useAppSelector(
    (state) => state.auth
  );

  const [formData, setFormData] = useState<FormData>({
    nom: "",
    postnom: "",
    prenom: "",
    email: "",
    phone: "",
    adresse: "",
    hectare_cultive: "",
    idprovince: "",
    idterritoire: "",
    idvillage: "",
    date_naiss: "",
    genre: "",
    password: "",
    confirmPassword: "",
  } as FormData);
  const [errors, setErrors] = useState({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value.trim() });
    setErrors({ ...errors, [name]: "" }); // Clear error when input changes
  };

  const validateStep = () => {
    const stepErrors: any = {};
    switch (step) {
      case 1:
        if (!formData.nom) stepErrors.nom = "Le nom est requis";
        if (formData.nom.length < 3)
          stepErrors.nom = "Le nom est trop court, minimum 3 caractères";
        if (formData.nom.length > 50)
          stepErrors.nom = "Le nom est trop long, maximum 50 caractères";
        if (!formData.postnom) stepErrors.postnom = "Nom de famille est requis";
        if (formData.postnom.length < 3)
          stepErrors.postnom =
            "Nom de famille est trop court, minimum 3 caractères";
        if (formData.postnom.length > 50)
          stepErrors.postnom =
            "Nom de famille est trop long, maximum 50 caractères";
        if (!formData.phone)
          stepErrors.phone = "Le numéro de téléphone est requis";
        if (formData.phone.length < 9)
          stepErrors.phone =
            "Le numéro de téléphone est trop court, minimum 9 caractères";
        if (formData.phone.length > 13)
          stepErrors.phone =
            "Le numéro de téléphone est trop long, maximum 13 caractères";
        if (!/^\+?\d+$/.test(formData.phone))
          stepErrors.phone = "Le numéro de téléphone n'est pas valide";
        if (!formData.genre) stepErrors.genre = "genre is required";
        break;

        // only date of birth that is more than 18 years old
        formData.date_naiss &&
          new Date().getFullYear() -
            new Date(formData.date_naiss).getFullYear() <
            16 &&
          (stepErrors.date_naiss = "Vous devez avoir au moins 16 ans");
        break;
      case 2:
        if (!formData.password)
          stepErrors.password = "Le mot de passe est requis";
        if (formData.password && formData.password.length < 6)
          stepErrors.password =
            "Le mot de passe est trop court, minimum 6 caractères";
        if (formData.password !== formData.confirmPassword)
          stepErrors.confirmPassword = "Passwords do not match";
        break;
      default:
        break;
    }
    return stepErrors;
  };

  const nextStep = () => {
    const validationErrors = validateStep();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      setStep(step + 1);
    }
  };

  const prevStep = () => setStep(step - 1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateStep();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      try {
        dispatch(registerUser(formData));
      } catch (error) {
        notify("Invalid email or password", "error");
      }
    }
  };

  useEffect(() => {
    if (status === 201 && !loading) {
      if (typeof window !== "undefined") {
        localStorage.setItem("phone", formData.phone);
      }
      router.push("/validation");
      notify("Compte créé  avec success!", "success");
      notify("Veuillez vérifier votre compte!", "info");
      setFormData({
        nom: "",
        postnom: "",
        prenom: "",
        email: "",
        phone: "",
        adresse: "",
        hectare_cultive: "",
        idprovince: "",
        idterritoire: "",
        idvillage: "",
        date_naiss: "",
        genre: "",
        password: "",
        confirmPassword: "",
      });
      dispatch(setStatus(null));
    } else if (status === 500 && !loading) {
      notify("Téléphone/e-mail ou mot de passe invalide", "error");
      dispatch(setStatus(null));
    } else if (status === 409 && !loading) {
      notify(
        "Le numéro de téléphone et/ou l’adresse e-mail est/sont déjà utilisé(s)",
        "error"
      );
      dispatch(setStatus(null));
    }
  }, [status, error, notify, loading, router, formData.phone, dispatch]);

  const provinceList = (
    provinces as { data: { rows: any[] } }
  )?.data?.rows?.map((item) => {
    const { province, ...rest } = item;
    return { ...rest, name: province };
  });

  const territoiresList = (
    territoires as { data: { rows: any[] } }
  )?.data?.rows?.map((item) => {
    const { territoire, ...rest } = item;
    return { ...rest, name: territoire };
  });

  const villagesList = (villages as { data: { rows: any[] } })?.data?.rows?.map(
    (item) => {
      const { village, ...rest } = item;
      return { ...rest, name: village };
    }
  );

  const filteredTerritoires = territoiresList?.filter(
    (item) => item.idprovince == formData.idprovince
  );

  const filteredVillages = villagesList?.filter(
    (item) => item.idterritoire == formData.idterritoire
  );

  const grenreList = [
    { id: "F", name: "Feminin" },
    { id: "M", name: "Masculin" },
  ];

  return (
    <div className="w-full mx-auto  p-8 rounded-lg">
      {step === 1 && (
        <Step1
          formData={formData}
          errors={errors}
          handleChange={handleChange}
          genres={grenreList}
        />
      )}
      {step === 2 && (
        <Step2
          formData={formData}
          errors={errors}
          handleChange={handleChange}
        />
      )}

      <div className="flex justify-between mt-4">
        {step > 1 && (
          <button
            type="button"
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded"
            onClick={prevStep}
          >
            Previous
          </button>
        )}
        {step < 2 && (
          <button
            type="button"
            className="bg-secondary-green/90 hover:bg-secondary-green text-white py-2 px-4 rounded"
            onClick={nextStep}
          >
            Next
          </button>
        )}
        {step === 2 && (
          <button
            type="submit"
            onClick={handleSubmit}
            className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
          >
            {loading ? "Chargement ..." : "Soumettre"}
          </button>
        )}
      </div>
      <p className="mt-10 text-center text-[14px] text-gray-500">
        Vous avez déjà un compte{" "}
        <Link
          href="/login"
          className="font-semibold text-primary-green hover:text-secondary-green"
        >
          Se Connecter
        </Link>
      </p>
    </div>
  );
};

const Step1 = ({ formData, errors, handleChange, genres }: any) => (
  <div className="space-y-5">
    <h2 className="text-[20px] font-semibold mb-4 text-dark">
      Étape 1 : Informations personnelles de base
    </h2>

    <TextInput
      type="text"
      error={errors.nom}
      required={true}
      name="nom"
      id="nom"
      minLength={3}
      maxLength={50}
      value={formData.nom}
      onChange={handleChange}
      label="Nom"
      placeholder="Entrer votre nom"
    />

    <TextInput
      type="text"
      error={errors.postnom}
      name="postnom"
      id="postnom"
      minLength={3}
      maxLength={50}
      value={formData.postnom}
      onChange={handleChange}
      label="Nom de famille / Post Nom"
      placeholder="Entrer votre nom de famille"
      required={true}
    />

    <TextInput
      type="text"
      error={errors.phone}
      name="phone"
      id="phone"
      value={formData.phone}
      onChange={handleChange}
      minLength={9}
      maxLength={13}
      label="Numero de téléphone"
      placeholder="Entrer votre numéro de téléphone"
      required={true}
    />

    <TextSelect
      error={errors.genre}
      name="genre"
      id="genre"
      value={formData.genre}
      onChange={handleChange}
      label="Genre"
      placeholder="Choisir votre genre"
      required={true}
      data={genres}
    />
  </div>
);

const Step2 = ({ formData, errors, handleChange }: any) => (
  <div className="space-y-5">
    <h2 className="text-[20px] font-semibold mb-4 text-dark">
      Étape 2 : Informations de Securité
    </h2>

    <TextInput
      type="password"
      error={errors.password}
      name="password"
      id="password"
      value={formData.password}
      onChange={handleChange}
      label="Créer un mot de passe"
      placeholder="********"
      required={true}
    />

    <TextInput
      type="password"
      error={errors.confirmPassword}
      name="confirmPassword"
      id="confirmPassword"
      value={formData.confirmPassword}
      onChange={handleChange}
      label="Confirmer le mot de passe"
      placeholder="********"
      required={true}
    />
  </div>
);

export default RegisterForm;
