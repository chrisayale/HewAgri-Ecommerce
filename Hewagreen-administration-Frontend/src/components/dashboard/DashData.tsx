import { Table, Tag } from "antd";
import React from "react";

const DashData = ({ dash }: { dash: any }) => {
  return (
    <div className=" flex flex-col gap-6">
      <div>
        <p className=" font-medium text-base text-center uppercase">
          Table démographique par ville
        </p>
      </div>
      <div>
        <Table
          size="small"
          className="dark:!bg-slate-700"
          pagination={{
            hideOnSinglePage: true,
            pageSize: 50,
          }}
          bordered
          //   loading={isLoading}
          dataSource={dash?.per_town}
          scroll={{ y: 750, x: 1500 }}
          // Définir une hauteur de défilement
          sticky
          columns={[
            {
              key: "id",
              dataIndex: "id",
              title: "N°",
              render: (_, __, index) => index + 1,
              width: "3rem",
            },
            {
              title: "Ville",
              dataIndex: "town",
              key: "town",
              render: (_, item, index) => {
                return <p className=" text-black">{item?.designation}</p>;
              },
            },

            {
              title: "Total population",
              children: [
                {
                  title: "Total",
                  dataIndex: "population",
                  key: "population",
                  render: (_, item, index) => item?.citizen?.total,
                  align: "center",
                },
                {
                  title: "Homme",
                  dataIndex: "male",
                  key: "male",
                  render: (_, item, index) => item?.citizen?.male,
                  align: "center",
                },
                {
                  title: "Femme",
                  dataIndex: "female",
                  key: "female",
                  render: (_, item, index) => item?.citizen?.female,
                  align: "center",
                },
              ],
              align: "center",
            },
            {
              title: "Menages",
              children: [
                {
                  title: "Total",
                  dataIndex: "menage",
                  key: "menage",
                  render: (_, item, index) => item?.menage?.total,
                  align: "center",
                },
                {
                  title: "locataire",
                  dataIndex: "location",
                  key: "location",
                  render: (_, item, index) => item?.menage?.location,
                  align: "center",
                },
                {
                  title: "Propiétaire",
                  dataIndex: "owner",
                  key: "owner",
                  render: (_, item, index) => item?.menage?.owner,
                  align: "center",
                },
              ],
              align: "center",
            },
            {
              title: "Etat civile",
              children: [
                {
                  title: "Célibataire",
                  dataIndex: "single",
                  key: "single",
                  render: (_, item, index) =>
                    item.citizen?.marital_state?.single,
                  align: "center",
                },
                {
                  title: "Mariés",
                  dataIndex: "male",
                  key: "male",
                  render: (_, item, index) =>
                    item.citizen?.marital_state?.maried,
                  align: "center",
                },
                {
                  title: "Divorcés",
                  dataIndex: "divorced",
                  key: "divorced",
                  render: (_, item, index) =>
                    item.citizen?.marital_state?.divorced,
                  align: "center",
                },
                {
                  title: "veuf/veuve",
                  dataIndex: "widower",
                  key: "widower",
                  render: (_, item, index) =>
                    item.citizen?.marital_state?.widowers,
                  align: "center",
                },
                {
                  title: "Autre",
                  dataIndex: "other",
                  key: "other",
                  render: (_, item, index) =>
                    item.citizen?.marital_state?.maried_other,
                  align: "center",
                },
              ],
              align: "center",
            },
          ]}
          components={{
            header: {
              cell: ({ children, ...rest }: { children: React.ReactNode }) => (
                <td
                  {...rest}
                  className="p-2 !bg-white !text-slate-500 dark:!text-slate-900 !font-bold dark:!bg-slate-500"
                >
                  {children}
                </td>
              ),
            },
            body: {
              cell: ({ children, ...rest }: { children: React.ReactNode }) => (
                <td
                  {...rest}
                  className="!text-slate-500 dark:!bg-[#1F2937] dark:!text-slate-300 dark:!border-slate-700"
                >
                  {children}
                </td>
              ),
            },
          }}
        />
      </div>
    </div>
  );
};

export default DashData;
